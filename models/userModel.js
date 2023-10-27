const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");


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
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// This is virtual, so it's not stored in Database
userSchema.virtual("durationWeeks").get(function () {
    return this.duration / 7;
});

//MONGOOSE MIDDLEWARE
//
// //Document MIDDLEWARE: runs before .save() or .create()
// userSchema.pre("save", function (next) {
//     this.slug = slugify(this.name, { lower: true });
//     next();
// });

// nftSchema.pre("save", function (next) {
//   console.log("document will save....");
//   next();
// });

// nftSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

//QYERY MIDDLEWARE

//---------pre
// userSchema.pre("find", function (next) {
// userSchema.pre(/^find/, function (next) {
//     this.find({ secretNfts: { $ne: true } });
//     this.start = Date.now();
//     next();
// });

// userSchema.pre("findOne", function (next) {
//   this.find({ secretNfts: { $ne: true } });
//   next();
// });

// //-----post
// userSchema.post(/^find/, function (doc, next) {
//     console.log(`Query took time: ${Date.now() - this.start} times`);
//     // console.log(doc);
//     next();
// });
//
// //AGGREATION MIDDLEWARE
// userSchema.pre("aggregate", function (next) {
//     this.pipeline().unshift({ $match: { secretNfts: { $ne: true } } }); // this says don't include secret NFTs in any response
//     // console.log(this.pipeline());
//     next();
// });

const User = mongoose.model("User", userSchema);

module.exports = User;