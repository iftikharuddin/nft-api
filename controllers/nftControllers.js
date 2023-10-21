const NFT = require("../models/nftModel");
const APIFeatures = require("./../Utils/apiFeatures");
const catchAsync = require("./../Utils/catchAsync");

// get top 5
exports.aliasTopNFTs = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

// get all nfts function
exports.getAllNFTs = catchAsync(async (req, res) => {
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

});

// Post method to create new NFT
exports.createNFT = catchAsync(async (req, res) => {

    const newNFT = await NFT.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            nft: newNFT
        }
    })

});

exports.getSingleNFT = catchAsync(async (req, res) => {
    const nft = await NFT.findById(req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            nft
        }
    });
});

exports.updateNFT = catchAsync(async (req, res) => {
    const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true // this tells the model to apply validation rules
    });
    res.status(200).json({
        status: "success",
        data: {
            nft
        }
    });
});

exports.deleteNFT = catchAsync(async (req, res) => {
    await NFT.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: "success",
        data: {
            nft: null
        }
    });
});

//Aggregation Pipeline
exports.getNFTsStats = catchAsync(async (req, res) => {
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
    ]);
    res.status(200).json({
        status: "success",
        data: {
            stats,
        },
    });
});

//CALCULATING NUMBER OF NFT CREATE IN THE MONTH OR MONTHLY PLAN
exports.getMonthlyPlan = catchAsync(async (req, res) => {
    const year = req.params.year * 1;
    const plan = await NFT.aggregate([
        {
            $unwind: "$startDates",
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numNFTStarts: { $sum: 1 },
                nfts: { $push: "$name" },
            },
        },
        {
            $addFields: {
                month: "$_id",
            },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: {
                numNFTStarts: -1,
            },
        },
        {
            $limit: 12,
        },
    ]);
    res.status(200).json({
        status: "success",
        data: plan,
    });
});