const express = require('express');
const router = express.Router();

const {authAdmin} = require("../middleware/auth");
const {upload} = require("../middleware/upload");
const {addResearch,getAllResearch,deleteResearch,updateResearch,updateViews} = require("../controller/research");

router.post("/addresearch",authAdmin,upload.array("images",10),addResearch);
router.get("/getallresearch",getAllResearch);
router.delete("/deleteresearch/:id",authAdmin,deleteResearch);
router.put('/updateresearch/:id',authAdmin,upload.array("images",10),updateResearch)
router.put('/updateactionresearch',updateViews);

module.exports = router;