const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const nftsRouter = require("./routes/nftsRoute");
const usersRouter = require("./routes/usersRoute");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// Custom Middle Ware
app.use((req, res, next) => {
    console.log("Hey I am form middleware");
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

const port = 3000;

app.listen(port, ()=> {
    console.log(`App running on port ${port} ....`)
});