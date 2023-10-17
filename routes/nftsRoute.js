const express = require("express");

// const nftControllers = require("./../controllers/nftControllers");
const {
    getAllNFTs,
    createNFT,
    getSingleNFT,
    updateNFT,
    deleteNFT,
} = require("./../controllers/nftControllers");

const router = express.Router();

router.route("/").get(getAllNFTs).post(createNFT);
router
    .route("/:id")
    .get(getSingleNFT)
    .patch(updateNFT)
    .delete(deleteNFT);

module.exports = router;
