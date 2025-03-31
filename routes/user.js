const express = require('express');
const router = express.Router();

// controller
const {register,checkUsername,login,getSingle,logout,
    updateData,emailUpdate,checkPassword,updatePassword,
    checkEmail,getAll,deleteUser} = require('../controller/user');
// middleware
const {upload} = require('../middleware/upload');
const {auth,authAdmin} = require('../middleware/auth');

// addd new user
router.post('/register',upload.single('file'),register);
// check username
router.get('/checkusername/:username',checkUsername);
// login
router.post('/login',login);
// get one user
router.get('/getone',auth,getSingle);
// logout
router.get('/logout',logout);
// update user
router.put('/update',auth,upload.single('file'),updateData);
// update email
router.put("/update/email",auth,emailUpdate);
// checkpassword
router.post("/checkauth",auth,checkPassword);
// update password
router.put('/updatepass',auth,updatePassword);
// check email
router.post('/checkemail',checkEmail);
// update pass no auth
router.put("/updatepass/noauth",updatePassword);
// get all users
router.get('/getall',getAll);
// delete user
router.delete('/deluser/:id',authAdmin,deleteUser);


module.exports = router;