const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.status(200).send({
        message: "My data",
        id:"uniqueId",
        description: "D ta na D"
    }); // 127.0.0.1:3000
});

const port = 3000;

app.listen(port, ()=> {
    console.log(`App running on port ${port} ....`)
});