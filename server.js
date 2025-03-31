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

const server = express();

server.use(cookieParser());
server.use(cors({origin:"http://localhost:5173",credentials:true}));
server.use("/uploads", express.static(path.join(__dirname, "uploads")));
server.use(express.urlencoded({extended:true}));
server.use(express.json());
server.use(morgan('dev'));
connect();

// routes
readdirSync('./routes').map((route) => server.use('/api',require('./routes/'+route)))

const PORT = process.env.PORT || 8989;
server.listen(PORT,() => console.log('Server is runing on port',PORT));

module.exports = server;

