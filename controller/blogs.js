const blogModel = require("../models/blogs");
const fs = require("fs");

exports.addNew = async (req,res) => {
    try {
        const {text,user_id} = req.body;
        if(!user_id)
            return res.status(400).json({err:"ไม่พบข้อมูล"});
        let imagesUrl = [];
        let emotion = {};
        if(req.files){
            imagesUrl = req.files.map((item) => item.filename);
            emotion.codes = req.body.codes;
            emotion.char = req.body.char;
            emotion.th = req.body.th;
        }

        const newBlog = new blogModel({
            text,user_id,emotion,images:imagesUrl
        })
        await newBlog.save();

        res.status(200).json({mes:"เพิ่มโพสต์ใหม่แล้ว"});
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Something went wrong at server side'});
    }
}

exports.getAll = async (req,res) => {
    try {
        const blogs = await blogModel.find();
        res.status(200).json({blogs});
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Something went wrong at server side'});
    }
}

exports.removeBlog = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id)return res.status(400).json({err:"ไม่พบข้อมูล"});

        await blogModel.findByIdAndDelete(id);
        res.status(200).json({mes:"ลบโพสต์ออกแล้ว"});
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Something went wrong at server side'});
    }
}

exports.updateBlog = async (req,res) => {
    try {
        const id = req.params.id;
        console.log("🚀 ~ exports.updateBlog= ~ id:", id)
        if(!id)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const post = await blogModel.findOne({_id:id});
        if(!post)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const {text,oldimg,img} = req.body;
        const deleteImgs = typeof(oldimg) === 'string' ? oldimg.split(",") : oldimg || []
        console.log("🚀 ~ exports.updateBlog= ~ req.body:", req.body)
        if(deleteImgs.length > 0){
            deleteImgs.map(async (img) => {
                await fs.unlink("./uploads/"+img,(err) => {
                    if(err)return console.log(err);
                })
            })
        }
        let images = [];
        let updatePost = {};
        if(req.files.length > 0){
            const imgArr = img.split(",");
            images = [...imgArr || [],...req.files.map((item) => item.filename)];
            updatePost = {text,emotion:{
                codes:req.body.codes,char:req.body.char,th:req.body.th
            },images:images.filter((item) => item !== "")};
        }else{
            images = img || [];
            updatePost = {text,emotion:req.body.emoji,images:images.filter((item) => item !== "")};
        }
                
        const update = await blogModel.findOneAndUpdate({_id:id},{...updatePost});
        if(!update)return res.status(400).json({err:"เกิดข้อผิดพลาดในการบันทึกข้อมูล"});

        res.status(200).json({mes:"บันทึกโพสต์แล้ว"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Something went wrong at server side'});
    }
}

exports.updateLike = async (req,res) => {
    try {
        const {id,update} = req.body;
        if(!id || !update)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const updateData = await blogModel.findOneAndUpdate({_id:id},{likes:update});
        if(!updateData)return res.status(400).json({err:"เกิดข้อผิดพลาดในการอัปเดต"});

        res.status(200).json({mes:"บันทึกข้อมูลแล้ว"});
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Something went wrong at server side'});
    }
}

exports.reportBlog = async (req,res) => {
    try {
        const {blogId,report} = req.body;
        if(!blogId || !report)return res.json({err:`ไม่พบข้อมูล ${id}`}).status(400);

        const blog = await blogModel.findOne({_id:blogId});
        if(!blog)return res.json({err:"ไม่พบข้อมูล"}).status(400);

        const updateReport = await blogModel.findOneAndUpdate({_id:blogId},{report:[...blog.report,...report]});
        if(!updateReport)return res.status(400).json({err:"เกิดข้อผิดพลาดในการบันทึกข้อมูล"});

        res.status(200).json({mes:"บันทึกข้อมูลแล้ว"});

    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Something went wrong at server side'});
    }
}