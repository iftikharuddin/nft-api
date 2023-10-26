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

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UnhandledRejection Shutting down application");
    process.exit(1);
});

// const testNFT = new NFT({
//     name: "My wild NFT",
//     rating: 1,
//     price: 12,
// });
//
// testNFT.save().then(docNFT => {
//     console.log(docNFT);
// }).catch(error => {
//     console.log("Error", error);
// });

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`App running on port ${port} ....`)
});