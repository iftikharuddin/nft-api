const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

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
            validate: [validator.isEmail, "Please provide a valid email"],
        },
        photo: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "guide", "creator", "user"],
            default: "user"
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 8,
            select: false // hide this from response
        },
        passwordConfirm: {
            type: String,
            // required: [true, "Please provide a confirm password"],
            // validate: {
            //     // this works only on create and save
            //     validator: function(el) {
            //         return el === this.password // check for confirmPassword
            //     },
            //     message: "Password is not same"
            // }
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date
    }
);
userSchema.pre("save", function(next) {

    if (!this.isModified("password") || this.isNew) return next(); // if someone is updating/editing just pass

    this.passwordChangedAt = Date.now() - 1000;

});

userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next(); // if someone is updating/editing just pass

    // now if someone is creating new account
    this.password = await bcrypt.hash(this.password, 12); // hash the password

    this.passwordConfirm  = undefined; // delete the confirm pass

    next();

});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp < changedTimestamp;
    }
    // by default we want to return false, means not changed
    return false;
};

userSchema.methods.createPasswordResetToken = function (){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;