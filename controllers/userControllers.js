const User = require("../models/userModel");
const APIFeatures = require("./../Utils/apiFeatures");
const catchAsync = require("./../Utils/catchAsync");
const AppError = require("./../Utils/appError");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // create error if updating password .. this is only for data updating
    if(req.body.password || req.body.passwordConfirm) {
        return next(new AppError("This route is not for password update", 400));
    }
    // update user data
    const filteredBody = filterObj(req.body, "name", "email");

    const updateUser = await User.findByIdAndUpdate(
        req.user.id, filteredBody, {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        status: "success",
        data: {
            user: updateUser
        }
    })

});
// Users Section
exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    });

});

exports.getSingeUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
};