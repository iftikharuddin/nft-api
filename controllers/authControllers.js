const jwt = require('jsonwebtoken');
const User = require("./../models/userModel");
const catchAsync = require("./../Utils/catchAsync");
const AppError = require("./../Utils/appError");

// Create token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

};

// signup
exports.signup = catchAsync( async (req, res, next ) => {
    // const newUser = await User.create(req.body); this will make everyone admin
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(200).json({
        status: "Success",
        token,
        data: {
            user: newUser
        }
    })
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

    const token = signToken(user.id);

    res.status(200).json({
        status: "success",
        token
    })

});