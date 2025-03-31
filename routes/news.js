const express = require('express');
const router = express.Router();

const {addNews,getAllNews,updateViews,getOneNews,updateLikesOrDisLikes,deleteNews,updateNews} = require("../controller/news");

const {authAdmin} = require('../middleware/auth');
const {upload} = require('../middleware/upload');

router.post("/addnews",authAdmin,upload.array('images',10),addNews);
router.get('/getallnews',getAllNews);
router.put('/updateview',updateViews);
router.get('/getonenews/:id',getOneNews);
router.put('/updatelikeordislike',updateLikesOrDisLikes);
router.delete('/deletenews/:id',authAdmin,deleteNews);
router.put('/updatenews',authAdmin,upload.array('images',10),updateNews)

module.exports = router;