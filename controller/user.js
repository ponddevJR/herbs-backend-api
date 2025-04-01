const userModel = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require("path");

exports.checkUsername = async (req,res) => {
    try {
        const user = req.params.username;
        console.log(user);
        const isRepeat = await userModel.findOne({username:user});
        if(isRepeat)return res.json({err:"ชื่อผู้ใช้งานนี้ถูกใช้แล้ว"}).status(400);
        res.json({mes:"ok"}).status(200);
    } catch (error) {
        res.json({err:"Somethig went wrong at server side"}).status(500);
        console.log(error);
    }
}

exports.register = async (req,res) => {
    try {
        const{username,password,
            fname,lname,email,phone,role,
            amphure,sub_dis,zip_code,province
        } = req.body;
        let profile_img;
        if(!req.file){
            profile_img = req.body.url;
        }else{
            profile_img = req.file.filename;
        }
        const isRepeat = await userModel.findOne({username});
        if(isRepeat)return res.json({err:"ชื่อผู้ใช้งานนี้ถูกใช้แล้ว"}).status(400);
        // เข้ารหัส
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password,salt);
        // insert new user
        const newUser = await userModel({
            username,password:hash,
            profile:{
                fname,lname,email,phone,profile_img
            },
            address:{
                province,amphure,sub_dis,zip_code
            },
            status:false,role,email_verify:true
        })
        await newUser.save();
        res.json({mes:"ลงทะเบียนสำเร็จ"}).status(200);

    } catch (error) {
        res.json({err:"Somethig went wrong at server side0"}).status(500);
        console.log(error);
    }
}

exports.login = async (req,res) => {
    try {
        const {username,password} = req.body;
        // check username
        const user = await userModel.findOne({username});
        if(!user)return res.json({err:'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง'}).status(401);
        // comparepassword
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)return res.json({err:'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง'}).status(401);

        if(!user.status)return res.json({err:"บัญชีถูกระงับชั่วคราว โปรดตรวจสอบอีเมล์หรือติดต่อผู้ดูแลระบบ"}).status(400);
        // isMatch
        const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1d'});
        // สร้าง cookie
        res.cookie('token',token,{
            maxAge:1000*60*60*24,
            secure:true,
            httpOnly:true,
            sameSite:'none',
            path:"/"
        })
        res.json({mes:"เข้าสู่ระบบแล้ว"}).status(200);
    } catch (error) {
        res.json({err:"Somethig went wrong at server side0"}).status(500);
        console.log(error);
    }
}

exports.getSingle = async (req,res) => {
    try {
        const id = req.user.id;
        const user = await userModel.findOne({_id:id}).select('-password');
        if(!user)return res.status(400).json({err:"ไม่พบผู้ใช้งาน"});

        res.status(200).json({user});
    } catch (error) {
        res.json({err:"Somethig went wrong at server side0"}).status(500);
        console.log(error);
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            expires: new Date(0),   // ลบ Cookie โดยทำให้หมดอายุ
            httpOnly: true,         // ป้องกันการเข้าถึงจาก JavaScript ฝั่ง Client
            secure: true,           // ใช้งานเฉพาะบน HTTPS
            sameSite: "None",       // รองรับ cross-site cookies
            path: "/"               // ลบ Cookie ทุก Path
        });

        return res.status(200).json({ mes: "ออกจากระบบแล้ว" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ err: "Something went wrong at server side" });
    }
};


exports.updateData = async (req,res) => {
    try {
        const { profile , address , ...other } = await req.body;
        let {_id,username,status,role,email_verify
            ,fname,lname,email,phone,province,amphure,sub_dis,
            zip_code,old
        } = other;
        if(req.file){
            await fs.unlink('./uploads/'+old,(err) => {
                if(err)return console.log(err);
            })
            const update = await userModel.findOneAndUpdate({_id},{
                username,profile:{fname,lname,email,phone,profile_img:req.file.filename},
                address:{province,amphure,sub_dis,zip_code},
                status,role,email_verify
            },{new:true});
            if(!update)return res.status(400).json({err:'เกิดข้อผิดพลาดในการบันทึกข้อมูล'});

            res.status(200).json({mes:"บันทึกข้อมูลสำเร็จ"});
        }else{
            const update = await userModel.findOneAndUpdate({_id},req.body,{new:true});
            if(!update)return res.status(400).json({err:'เกิดข้อผิดพลาดในการบันทึกข้อมูล'});

            res.status(200).json({mes:"บันทึกข้อมูลสำเร็จ"});
        }
    } catch (error) {
        res.json({err:"Somethig went wrong at server side0"}).status(500);
        console.log(error);
    }
}

exports.emailUpdate = async (req,res) => {
    try {
        const {_id,newEmail} = await req.body;
        if(!_id || !newEmail)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const update = await userModel.findOneAndUpdate({_id},{'profile.email':newEmail},{new:true});
        if(!update)return res.status(400).json({err:"ไม่สามารถบันทึกข้อมูลได้"});
        res.status(200).json({mes:"บันทึกอีเมล์สำเร็จ"});
    } catch (error) {
        res.json({err:"Somethig went wrong at server side0"}).status(500);
        console.log(error);
    }
}

exports.checkPassword = async (req,res) => {
    try {
        const {_id,password} = await req.body;
        if(!_id || !password)return res.status(400).json({err:"ข้อมูลไม่ถูกต้อง"});
        const user = await userModel.findOne({_id});
        if(!user)return res.status(400).json({err:"ข้อมูลไม่ถูกต้อง"});
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)return res.status(400).json({err:"ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง"});

        res.status(200).json({mes:"ok"});
    } catch (error) {
        res.json({err:"Somethig went wrong at server side0"}).status(500);
        console.log(error);
    }
}

exports.updatePassword = async (req,res) => {
    try {
        const {username,newPass} = await req.body;
        if(!username || !newPass)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const user = await userModel.findOne({username});
        if(!user)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const isMatch = await bcrypt.compare(newPass,user.password);
        if(isMatch)return res.status(400).json({err:"ไม่สามารถบันทึกข้อมูลได้"});

        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(newPass,salt);
        const update = await userModel.findOneAndUpdate({username},{password:hash},{new:true});
        if(!update)return res.status(400).json({err:"ไม่สามารถบันทึกข้อมูลได้"});

        res.status(200).json({mes:"บันทึกรหัสผ่านแล้ว"});
    } catch (error) {
        res.json({err:"Somethig went wrong at server side0"}).status(500);
        console.log(error);
    }
}


exports.checkEmail= async (req,res) => {
    try {
        const {username,email} = req.body;
        if(!username)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const user = await userModel.findOne({username});
        if(!user)return res.status(400).json({err:"ไม่พบข้อมูล"});

        if(user.profile.email !== email)
            return res.status(400).json({err:"อีเมล์ไม่ถูกต้อง"});

        res.status(200).json({mes:"ok"});
    } catch (error) {
        res.json({err:"Somethig went wrong at server side0"}).status(500);
        console.log(error);
    }
}

exports.getAll = async (req, res) => {
    try {
        const users = await userModel.find().select("-username -password");
        res.status(200).json({ users });
    } catch (error) {
        console.error("🚀 ~ getAll error:", error);
        res.status(500).json({ err: "Something went wrong at server side" });
    }
};


exports.deleteUser = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const user = await userModel.findOne({_id:id});
        // ลบไฟล์รูปภาพ folder upload
        if(user?.profile.profile_img.startsWith('i')){
            await fs.unlink("./uploads/"+user.profile.profile_img,(err) => {
                if(err)return console.log(err);
            })
        }

        await userModel.findByIdAndDelete(id);
        res.status(200).json({mes:"บัญชีผู้ใช้งานถูกลบแล้ว"});
    } catch (error) {
        res.json({err:"Somethig went wrong at server side0"}).status(500);
        console.log(error);
    }
}