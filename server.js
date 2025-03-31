const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv').config();
// const cookieParser = require('cookie-parser');
const {readdirSync} = require('fs');
// connect database
const connect = require('./config/db');

const app = express();

app.use(cookieParser());
app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan('dev'));
connect();

// routes
readdirSync('./routes').map((route) => server.use('/api',require('./routes/'+route)))

const PORT = process.env.PORT || 8989;
// server.listen(PORT,() => console.log('Server is runing on port',PORT));

module.exports = app;

