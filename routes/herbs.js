const express = require('express');
const router = express.Router();

// controller
const {addHerb,getAllHerbs,deleteHerb,updateHerb} = require("../controller/herbs");
// middleware
const {authAdmin} = require("../middleware/auth");
const {upload} = require("../middleware/upload");

router.post("/addherb",authAdmin,upload.array('images',10),addHerb);
router.get("/getallherb",getAllHerbs);
router.delete('/deleteherb/:id',authAdmin,deleteHerb);
router.put("/updateherb",authAdmin,upload.array("images",10),updateHerb);

module.exports = router;