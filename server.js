const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const { readdirSync } = require("fs");
require("dotenv").config();
const connect = require("./config/db");

const app = express();

app.get("/",(req,res) => res.send("hello vercel"));

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

connect();

// routes
readdirSync("../routes").map((route) => server.use("/api", require("../routes/" + route)));

// ❌ ลบ server.listen() ออก
app.listen(PORT, () => console.log("Server is running on port", PORT));

// ✅ ใช้ API Handler ของ Vercel แทน
// module.exports = app;
