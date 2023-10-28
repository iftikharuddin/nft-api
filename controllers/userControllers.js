const User = require("../models/userModel");
const APIFeatures = require("./../Utils/apiFeatures");
const catchAsync = require("./../Utils/catchAsync");
const AppError = require("./../Utils/appError");

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