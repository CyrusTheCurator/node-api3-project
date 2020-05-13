// code away!
const express = require("express");
const helmet = require("helmet");
const server = require("./server.js");
const userRouter = require("./users/userRouter");
const cors = require("cors");

server.use(express.json());
server.use(cors());
server.use(helmet());
server.use("/users", userRouter);
server.get("/", function (req, res) {
  res.send(`welcome to lambo bambo ${req.name}`);
});

server.listen(6969, () => {
  console.log("\n*** Server Running on http://localhost:6969 ***\n");
});
