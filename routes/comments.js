const express = require('express');
const router = express.Router();

const {addComments,getAllComments,updateComment,commentReport,updateContent,removeComment,clearReport} = require('../controller/comments');
const {auth, authAdmin} = require("../middleware/auth");

router.post("/addcomment",auth,addComments);
router.get("/getallcomments",getAllComments);
router.put("/updatelikes/:id",auth,updateComment);
router.put("/commentreport",auth,commentReport);
router.put("/updatecontent",auth,updateContent);
router.delete('/removecomment/:id',auth,removeComment);
router.put("/clearreport/:id",authAdmin,clearReport);

module.exports = router;