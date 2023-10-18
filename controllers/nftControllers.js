// const fs = require("fs");
//
// const nfts = JSON.parse(
//     fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
// );

const NFT = require("../models/nftModel");

// middleware
// exports.checkId = (req, res, next, value) => {
//     console.log(value);
//
//     // if(req.params.id * 1 > nfts.length )  {
//     //     return res.status(404).json({
//     //         status: "Failed",
//     //         message: "Invalid request, ID"
//     //     })
//     // }
//     next();
// };

// exports.checkBody = (req, res, next) => {
//     if(!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: "failed",
//             message: "Missing name and price"
//         })
//     }
//     next();
// };

// get all nfts function
exports.getAllNFTs = async (req, res) => {
    try {
        const nfts = await NFT.find();

        res.status(200).json({
            status: "success",
            results: nfts.length,
            data: {
                nfts
            }
        });
    } catch (e) {
        res.status(404).json({
            status: "failed",
            message: e,
        })
    }

};

// Post method to create new NFT
exports.createNFT = async (req, res) => {
   // const newNFT = new  NFT({})
   // newNFT.save();

    try {
        const newNFT = await NFT.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                nft: newNFT
            }
        })
    } catch (e) {
        // console.log("Error while creating new NFT", e);
        res.status(400).json({
            status: "fail",
            message: e
        });
    }
};

exports.getSingleNFT = async (req, res) => {
    // const id = req.params.id * 1;
    try {
        const nft = await NFT.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                nft
            }
        });
    } catch (e) {
        res.status(404).json({
            status: "failed",
            message: e,
        })
    }
};

exports.updateNFT = async (req, res) => {
    try {
        const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data: {
                nft
            }
        });
    } catch (e) {
        res.status(404).json({
            status: "failed",
            message: e,
        })
    }
};

exports.deleteNFT = async (req, res) => {
    try {
        await NFT.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: {
                nft: null
            }
        });
    }catch (e) {
        res.status(404).json({
            status: "failed",
            message: e
        });
    }

};