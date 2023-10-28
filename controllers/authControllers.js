const User = require("./../models/userModel");
const catchAsync = require("./../Utils/catchAsync");

// signup
exports.signup = catchAsync( async (req, res, next ) => {
    // const newUser = await User.create(req.body); this will make everyone admin
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    res.status(200).json({
        status: "Success",
        data: {
            user: newUser
        }
    })
});