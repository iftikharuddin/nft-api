const express = require("express");

// const nftControllers = require("./../controllers/nftControllers");
const {
    getAllNFTs,
    createNFT,
    getSingleNFT,
    updateNFT,
    deleteNFT,
    checkId,
    checkBody,
    aliasTopNFTs,
    getNFTsStats
} = require("./../controllers/nftControllers");

const router = express.Router();

// Custom Middleware
// router.param("id");

//TOP 5 NFTs BY PRICE
router
    .route("/top-5-nfts")
    .get(aliasTopNFTs, getAllNFTs);

//STATS ROUTE
router.route("/nfts-stats").get(getNFTsStats);

// router.route("/").get(getAllNFTs).post(checkBody, createNFT);
router.route("/").get(getAllNFTs).post(createNFT);
router
    .route("/:id")
    .get(getSingleNFT)
    .patch(updateNFT)
    .delete(deleteNFT);

module.exports = router;
