const express = require('express');
const userRouter = require("./user/user");
const todoRouter = require("./todo/todo");
const router = express.Router();


// <----- userRoutes -----> //
router.use("/users", userRouter);

// <----- tasksRoutes -----> //
router.use("/todos", todoRouter);

module.exports = router;
 