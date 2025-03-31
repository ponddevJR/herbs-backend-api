const newsModel = require('../models/news');
const fs = require('fs');

exports.addNews = async (req,res) => {
    try {
        if(!req.files)
            return res.status(400).json({err:"ไม่พบรูปภาพ"});
        const {title,content,herbsId} = req.body;
        if(!title || !content || !herbsId)
            return res.status(400).json({err:"ข้อมูลไม่ครบถ้วน"});

        const img_url = req.files;
        const newNews = new newsModel({
            title,content,herbs_id:herbsId.split(","),img_url:img_url.map((f) => f.filename)
        })
        await newNews.save();
        res.status(200).json({mes:"โพสต์ข่าวใหม่แล้ว"});

    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}

exports.getAllNews = async (req,res) => {
    try {
        const data = await newsModel.find();
        res.status(200).json({news:data});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}

exports.updateViews = async (req,res) => {
    try {
        const {_id} = req.body;
        const update = await newsModel.findByIdAndUpdate({_id},req.body);
        if(!update)return res.status(400).json({err:"เกิดข้อผิดพลาดในการดึงข้อมูล"});

        res.status(200).json({mes:"ok"});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}

exports.getOneNews = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id)return res.status(400).json({err:"news not found"});

        const data = await newsModel.findOne({_id:id});
        if(!data)return res.status(400).json({err:"news not found"});

        res.status(200).json({news:data});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}

exports.updateLikesOrDisLikes = async (req,res) => {
    try {
        const id = req.body._id;
        if(!id)return res.status(400).json({err:"user not found"});

        const update = await newsModel.findOneAndUpdate({_id:id},req.body,{new:false});
        if(!update)return res.status(400).json({err:"cannot update data"});

        res.status(200).json({mes:"ok"});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}

exports.deleteNews = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const news = await newsModel.findOne({_id:id});
        const delImgs = news.img_url;
        delImgs.forEach( async (item) => {
            await fs.unlink("./uploads/"+item,(err) => {
                if(err)return console.log(err);
            })
        })

        const del = await newsModel.findByIdAndDelete({_id:id});
        if(!del)return res.status(400).json({err:"ไม่สามารถลบข้อมูลได้"});

        res.status(200).json({mes:"ลบข่าวสำเร็จแล้ว"});
        
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}

exports.updateNews = async (req,res) => {
    try {
        const {_id,title,content,herbsId,oldImgs,delImgs,likes,dislikes,views} = req.body;
        if(!title || !content || !herbsId)return res.json({err:"ข้อมูลไม่ครบถ้วน"}).status(400);
        const decodeTitle = title[1];
        const decodeContent = content[1];
        
        const delImgsArr = delImgs.split(",");
        
        if(delImgsArr.length > 1){
            delImgsArr.forEach( async (item) => {
                await fs.unlink("./uploads/"+item,(err) => {
                    if(err)console.log(err);
                })
            })
        }

        let img_url ;
        if(req.files){
             img_url = !oldImgs ? req.files.map((item) => item.filename) : [...req.files.map((item) => item.filename),...oldImgs.split(",")];
        }else{
            img_url = oldImgs;
        }
       
        const herbs_id = herbsId.split(",");

        const updateNews = await newsModel.findOneAndUpdate({_id},{
            title:decodeTitle,content:decodeContent,herbs_id,img_url,likes,dislikes,views
        },{new:true})
        if(!updateNews)return res.json({err:"ไม่สามารถบันทึกข้อมูลได้"}).status(400);

        res.status(200).json({mes:"บันทึกข้อมูลแล้ว"});

    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}