const express = require("express");
const fs = require("fs");

const router = express.Router();

const nfts = JSON.parse(
    fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
);

// get all nfts function
const getAllNFTs = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "success",
        requestTime: req.requestTime,
        data: {
            nfts
        }
    });
};

const createNFT = (req, res) => {
    // console.log(req.body);
    // res.send("Post my NFT");
    const newId = nfts[nfts.length -1].id + 1;
    const newNFTs = Object.assign({id: newId}, req.body);

    nfts.push(newNFTs);

    fs.writeFileSync(`${__dirname}/nft-data/data/nft-simple.json`, JSON.stringify(nfts), err => {
        res.status(201).json({
            status: "success",
            nft: newNFTs
        })
    });
};

const getSingleNFT = (req, res) => {
    const id = req.params.id * 1;
    const nft = nfts.find((el) => (el.id === id));

    if(!nft) {
        return res.status(404).json({
            status: "Failed",
            message: "Invalid request, ID"
        })
    }
    res.status(200).json({
        status: "success",
        data: {
            nft
        }
    })
};

const updateNFT = (req, res) => {

    if(req.params.id * 1 > nfts.length )  {
        return res.status(404).json({
            status: "Failed",
            message: "Invalid request, ID"
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            nft: "Updating NFT"
        }
    });
};

const deleteNFT = (req, res) => {
    if(req.params.id * 1 > nfts.length )  {
        return res.status(404).json({
            status: "Failed",
            message: "Invalid request, ID"
        })
    }
    res.status(204).json({
        status: "success",
        data: {
            nft: null
        }
    });
};

router.route("/").get(getAllNFTs).post(createNFT);
router
    .route("/:id")
    .get(getSingleNFT)
    .patch(updateNFT)
    .delete(deleteNFT);

module.exports = router;
