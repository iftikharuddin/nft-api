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

process.on("uncaughtException", (err) => {
    console.log("UncaughtException Shutting down application");
    console.log(err);
    // server.close(() => {
        process.exit(1);
    // });

});
const port = process.env.PORT || 3000;

const server = app.listen(port, ()=> {
    console.log(`App running on port ${port} ....`)
});

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("UnhandledRejection Shutting down application");
    server.close(() => {
        process.exit(1);
    });

});


