const express = require("express");

const authController = require("./../controllers/authControllers");

const {
    getAllNFTs,
    createNFT,
    getSingleNFT,
    updateNFT,
    deleteNFT,
    checkId,
    checkBody,
    aliasTopNFTs,
    getNFTsStats,
    getMonthlyPlan
} = require("./../controllers/nftControllers");

const router = express.Router();

// Custom Middleware

//TOP 5 NFTs BY PRICE
router
    .route("/top-5-nfts")
    .get(aliasTopNFTs, getAllNFTs);

//STATS ROUTE
router.route("/nfts-stats").get(getNFTsStats);

//GET MONTHLY PLAN
router.route("/monthly-plan/:year").get(getMonthlyPlan);

// router.route("/").get(getAllNFTs).post(checkBody, createNFT);
router.route("/").get(authController.protect, getAllNFTs).post(createNFT);
router
    .route("/:id")
    .get(getSingleNFT)
    .patch(updateNFT)
    .delete(authController.protect, authController.restrictTo("admin", "guide"), deleteNFT);

module.exports = router;
