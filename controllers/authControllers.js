const jwt = require('jsonwebtoken');
const {promisify} = require("util");
const User = require("./../models/userModel");
const catchAsync = require("./../Utils/catchAsync");
const AppError = require("./../Utils/appError");
const sendEmail = require("./../Utils/email");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// Create token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        status: "Success",
        token,
        data: {
            user: user
        }
    })
};

// signup
exports.signup = catchAsync( async (req, res, next ) => {
    const newUser = await User.create(req.body); //this will make everyone admin
    createSendToken(newUser, 200, res);
});

// login

exports.login = catchAsync( async (req, res, next ) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new AppError("Please provide your email and password "));
    }

    const user = await User.findOne({ email }).select("+password");

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next( new AppError("Incorrect email and password", 401));
    }
    createSendToken(user, 200, res);

});

// protecting data
exports.protect = catchAsync( async (req, res, next ) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return next(new AppError("You are not logged in to get access", 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);

    if(!freshUser) {
        return next(AppError("The user belonging to this token doesn't exists", 401));
    }

    // change password
    if(await freshUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError("User recently changed the password", 401)
        )
    };

    // user will have access to protected data
    req.user = freshUser;
    next();
});

exports.restrictTo =  (...roles ) => {
    return(req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
                new AppError("You have no access to delete NFT", 403)
            )
        }
    }
    next();
};


// forget password
exports.forgotPassword =  catchAsync(async(req, res, next) => {
    // get user email
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new AppError("There is no user with this email", 404));
    }

    // create a random token
    const resetToken = user.createPasswordResetToken();
    await user.save({validationBeforeSave: false});

    // send email for verification
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Did you forget your password? Submit a PATCH Request with your new password and confirm password t0: ${resetURL}.\n If you didn't forget your password please ignore this message`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Your Password Reset Token",
            message,
        });

        res.status(200).json({
            status: "success",
            message: "Token sent to email"
        })
    }catch (e) {
        (user.passwordResetToken = undefined);
        (user.passwordResetExpires = undefined);
        await user.save({validationBeforeSave: false});
        console.log(e);
        return next(new AppError("Error while sending an email, Try again", 500));
    }
});

// reset password
exports.resetPassword =  catchAsync(async (req, res, next) => {
    // get user on token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });

    if(!user) {
        return next(new AppError("Token is invalid or has expired", 400))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.update({validationBeforeSave: false}); // @audit should it be save or update?

    createSendToken(user, 200, res);
});

// Updating the password
exports.updatedPassword = catchAsync(async (req, res, next) => {
    // get user from collection of data
    const user = await User.findById(req.user.id).select("+password");
    // check if the user current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError("Your current password is wrong", 401));
    }
    // updating the password
    // user.password = req.body.password;
    // user.passwordConfirm = req.body.passwordConfirm;
    const newPass = await bcrypt.hash(req.body.password, 12); // hash the password
    const newConfirmPass = await bcrypt.hash(req.body.passwordConfirm, 12); // hash the password

    const newUser = await User.updateOne(
        { _id: user.id }, // Filter by _id
        {
            $set: {
                password: newPass,
                passwordConfirm: newConfirmPass,
            },
        }
    );

    console.log(`Updated: ${newUser}`);
    //await user.save({validationBeforeSave: false}); // @audit should it be save or update?

    // log user
    createSendToken(newUser, 200, res);
});
