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

exports.aliasTopNFTs = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

// get all nfts function
exports.getAllNFTs = async (req, res) => {
    try {
        // BUILD QUERY
        const queryObj = { ...req.query };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);
        // console.log(req.query, queryObj);

        //ADVANCE FILTERING QUERY
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // console.log(JSON.parse(queryStr));

        let query = NFT.find(JSON.parse(queryStr));
        // {difficulty: "easy", duration: {$gte: 5}}
        // { difficulty: 'easy', duration: { gte: '5' } }
        // { difficulty: 'easy', duration: { '$gte': '5' } }

        //SORTING METHOD
        if (req.query.sort) {
          const sortBy = req.query.sort.split(",").join(" ");
          console.log(sortBy);
          query = query.sort(sortBy);
        } else {
          query = query.sort("-createdAt");
        }

        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }

        //PAGINATIONS FUNCTION

        // page=2&limit=3, page = 1, 1 -10, page 2, 11 -20, page 3, 21 -30
        const page = req.query.page * 1 || 1; // get page number
        const limit = req.query.limit * 1 || 10; // how much you wanna display one a page?
        const skip = (page - 1) * limit; // skip the last page

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
          const newNFTs = await NFT.countDocuments();
          if (skip >= newNFTs) throw new Error("This page dosen't exist");
        }

        const nfts = await query;

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