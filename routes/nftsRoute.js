const express = require("express");

// const nftControllers = require("./../controllers/nftControllers");
const {
    getAllNFTs,
    createNFT,
    getSingleNFT,
    updateNFT,
    deleteNFT,
    checkId,
    checkBody
} = require("./../controllers/nftControllers");

const router = express.Router();

// Custom Middleware
router.param("id", checkId);

router.route("/").get(getAllNFTs).post(checkBody, createNFT);
router
    .route("/:id")
    .get(getSingleNFT)
    .patch(updateNFT)
    .delete(deleteNFT);

module.exports = router;
