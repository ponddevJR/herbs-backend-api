const express = require("express");
const router = express.Router();

// controller
const {addNew,getAll,removeBlog,updateBlog,updateLike,reportBlog} = require("../controller/blogs");
// middleware
const {auth} = require("../middleware/auth");
const {upload} = require("../middleware/upload");

router.post("/addnewblog",auth,upload.array("images",10),addNew);
router.get("/allblogs",auth,getAll);
router.delete("/deleteblog/:id",auth,removeBlog);
router.put("/updateblog/:id",auth,upload.array("images",10),updateBlog);
router.put("/updatelikes",auth,updateLike);
router.put(`/addreportblog`,auth,reportBlog);

module.exports = router;