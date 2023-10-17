const express = require("express");

const router = express.Router();

const userControllers = require("./../controllers/userControllers")

// Router Users
router.route("/").get(userControllers.getAllUsers).post(userControllers.createUser);
router
    .route("/:id")
    .get(userControllers.getSingeUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser);

module.exports = router;