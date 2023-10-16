const fs = require("fs");
const express = require("express");

const app = express();

app.use(express.json({ extended: false }));

const nfts = JSON.parse(
    fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
);

app.get('/test', (req, res) => {
    res.json({msg: 'Hello world!!!'});
});

// get request
app.get("/api/v1/nfts", (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            nfts
        }
    });
});

// post request
app.post("/api/v1/nfts", (req, res) => {
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

    // res.send("Post my NFT");
});

const port = 3000;

app.listen(port, ()=> {
    console.log(`App running on port ${port} ....`)
});