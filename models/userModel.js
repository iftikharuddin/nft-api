const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A NFT must have a name"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"]
        },
        photo: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 8,
        },
        passwordConfirm: {
            type: String,
            required: [true, "Please provide a confirm password"],
            validate: {
                // this works only on create and save
                validator: function(el) {
                    return el == this.password // check for confirmPassword
                },
                message: "Password is not same"
            }
        }
    }
);

userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next(); // if someone is updating/editing just pass

    // now if someone is creating new account
    this.password = await bcrypt.hash(this.password, 12); // hash the password

    this.passwordConfirm  = undefined; // delete the confirm pass

    next();

});
const User = mongoose.model("User", userSchema);

module.exports = User;