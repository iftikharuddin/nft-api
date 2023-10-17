const fs = require("fs");

const nfts = JSON.parse(
    fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
);

// middleware
exports.checkId = (req, res, next, value) => {
    console.log(value);

    if(req.params.id * 1 > nfts.length )  {
        return res.status(404).json({
            status: "Failed",
            message: "Invalid request, ID"
        })
    }
    next();
};

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "failed",
            message: "Missing name and price"
        })
    }
    next();
};

// get all nfts function
exports.getAllNFTs = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "success",
        requestTime: req.requestTime,
        data: {
            nfts
        }
    });
};

exports.createNFT = (req, res) => {
    // console.log(req.body);
    res.send("Post my NFT");
    const newId = nfts[nfts.length -1].id + 1;
    const newNFTs = Object.assign({id: newId}, req.body);

    nfts.push(newNFTs);

    fs.writeFile(`${__dirname}/../nft-data/data/nft-simple.json`, JSON.stringify(nfts), err => {
        res.status(201).json({
            status: "success",
            nft: newNFTs
        })
        console.log(err);
    });
};
// exports.createNFT = (req, res) => {
//   const newId = nfts[nfts.length - 1].id + 1;
//   const newNFTs = Object.assign({ id: newId }, req.body);
//   nfts.push(newNFTs);
//   fs.writeFile(
//     `${__dirname}/nft-data/data/nft-simple.json`,
//     JSON.stringify(nfts),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         nft: newNFTs,
//       });
//     }
//   );
// };


exports.getSingleNFT = (req, res) => {
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

exports.updateNFT = (req, res) => {

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

exports.deleteNFT = (req, res) => {

    res.status(204).json({
        status: "success",
        data: {
            nft: null
        }
    });
};