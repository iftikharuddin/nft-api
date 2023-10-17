const express = require("express");
const fs = require("fs");

const router = express.Router();

// USERS Section
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
};

const getSingeUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
};

const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
};

// Router Users
router.route("/").get(getAllUsers).post(createUser);
router
    .route("/:id")
    .get(getSingeUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;