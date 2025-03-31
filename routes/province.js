const express = require('express');
const router = express.Router();

const {getProvince} = require('../controller/province');

router.get('/province/:name',getProvince);

module.exports = router;