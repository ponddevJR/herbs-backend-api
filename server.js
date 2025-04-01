const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const { readdirSync } = require("fs");
require("dotenv").config();
const connect = require("./config/db");

const app = express();

app.use(cookieParser());
app.use(cors({ origin: "https://herbs-front-react-hazel.vercel.app", credentials: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

connect();

// routes
const PORT = process.env.PORT;
readdirSync("./routes").map((route) => app.use("/api", require("./routes/" + route)));

// ❌ ลบ server.listen() ออก
app.listen(PORT, () => console.log("Server is running on port", PORT));

// ✅ ใช้ API Handler ของ Vercel แทน
// module.exports = app;
