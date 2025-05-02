const express = require("express");
require('dotenv').config();
const db = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;
const errorHandler = require("./middlewares/errorHandler")
const authRouter = require("./routes/auth.route")
const userRouter = require("./routes/task.route")
app.use(express.json())


// Public Routes
app.use("/api/auth",authRouter)

// Private Route
app.use("/api/auth/user",userRouter)

app.use(errorHandler)
app.listen(PORT,()=>console.log(`server is running at http://localhost:${PORT}`))