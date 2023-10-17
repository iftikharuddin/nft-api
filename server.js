const app = require("./App");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env"});

const DB = process.env.DATABASE_URL;

mongoose.connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
}).then((con)=>{
    // console.log(con.connection);
    console.log("Connected Successfully");
});

// console.log(process.env.NODE_ENV);

const nftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    rating: {
        type: Number,
        default: 3
    },
    price: {
        type: Number,
        required: [true, "NFT must have a price"]
    },
});

const NFT = mongoose.model("NFT", nftSchema);

const testNFT = new NFT({
    name: "My wild NFT",
    rating: 1,
    price: 12,
});

testNFT.save().then(docNFT => {
    console.log(docNFT);
}).catch(error => {
    console.log("Error", error);
});

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`App running on port ${port} ....`)
});