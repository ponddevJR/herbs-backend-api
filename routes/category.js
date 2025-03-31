const express = require('express');
const router = express.Router();

// controller
const {addCategory,getAllCategories,updateCategory,deleteCategory} = require("../controller/category");
// middleware
const {authAdmin} = require("../middleware/auth");

// new category
router.post('/newcategory',authAdmin,addCategory);
// get all categories
router.get("/getallctg",getAllCategories);
// update category
router.put('/updatectg',authAdmin,updateCategory);
// delete category
router.delete('/deletectg/:id',authAdmin,deleteCategory);

module.exports = router;