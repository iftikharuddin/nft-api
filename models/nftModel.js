const mongoose = require("mongoose");


const nftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    rating: {
        type: Number,
        default: 3
    },
    price: {
        type: Number,
        required: [true, "NFT must have a price"]
    },
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
