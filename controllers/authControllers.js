const User = require("./../models/userModel");
const catchAsync = require("./../Utils/catchAsync");

// signup
exports.signup = catchAsync( async (req, res, next ) => {
    const newUser = await User.create(req.body);

    res.status(200).json({
        status: "Success",
        data: {
            user: newUser
        }
    })
});