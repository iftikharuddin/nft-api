const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const AppError = require("./Utils/appError");
const nftsRouter = require("./routes/nftsRoute");
const usersRouter = require("./routes/usersRoute");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Template demo
app.use(express.static(`${__dirname}/nft-data/img`));


// Custom Middle Ware
app.use((req, res, next) => {
    console.log("Hey I am form middleware");
    next();
});

// Global vars data
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

// Error handling globally
// note: this should be at bottom ( cuz code executes from top to bottom )
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});


// Global Error Handling
app.use(globalErrorHandler);


module.exports = app;