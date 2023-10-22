// for development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

// for Production
const sendErrorPro = (err, res) => {
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: "error",
            message: "Something went very wrong"
        })
    }

};

module.exports = (err, req, res, next)=> {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if(process.env.NODE_ENV === "production") {
        sendErrorPro(err, res);
    }
    next();
};