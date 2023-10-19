const NFT = require("../models/nftModel");
const APIFeatures = require("./../Utils/apiFeatures");

// get top 5
exports.aliasTopNFTs = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

// get all nfts function
exports.getAllNFTs = async (req, res) => {
    try {
        const features = new APIFeatures(NFT.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const nfts = await features.query;

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

//Aggregation Pipeline
exports.getNFTsStats = async (req, res) => {
    try {
        const stats = await NFT.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    // _id: "$ratingsAverage",
                    _id: { $toUpper: "$difficulty" },
                    numNFT: { $sum: 1 },
                    numRatings: { $sum: "$ratingsQuantity" },
                    avgRating: { $avg: "$ratingsAverage" },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
            {
                $sort: { avgRating: 1 },
            },
            // {
            //   $match: {
            //     _id: { $ne: "EASY" },
            //   },
            // },
        ]);
        res.status(200).json({
            status: "success",
            data: {
                stats,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error,
        });
    }
};
