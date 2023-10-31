const express = require("express");
const userControllers = require("./../controllers/userControllers")
const authControllers = require("./../controllers/authControllers")

const router = express.Router();

router.post("/login", authControllers.login);
router.post("/signup", authControllers.signup);

router.post("/forgotPassword", authControllers.forgotPassword);
router.post("/resetPassword", authControllers.resetPassword);

// Router Users
router.route("/").get(userControllers.getAllUsers).post(userControllers.createUser);
router
    .route("/:id")
    .get(userControllers.getSingeUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser);

module.exports = router;