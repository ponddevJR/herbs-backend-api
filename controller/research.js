const researchModel = require("../models/research");
const fs = require("fs");

exports.addResearch = async (req,res) => {
    try {
        const {title,author,objective,source,herbs_id,year,imgs} = req.body;
        console.log("🚀 ~ exports.addResearch= ~ req.body:", req.body)
        if(!title || !author || !objective || !source || !herbs_id || !year)
            return res.json({err:"ข้อมูลไม่ถูกต้อง"}).status(400);

        let imgsArr = [];
        if(req.files){
            imgsArr = imgs ? [...imgs.split(","),...req.files.map((item) => item.filename)] : req.files.map((item) => item.filename);
        }else{
            imgsArr = req.body.imgs.map((item) => item.src);
        }

        const newResearch = new researchModel({
            title,author,objective,source,year,herbs_id:typeof(herbs_id) === 'string' ? herbs_id.split(",") : herbs_id,
            imgs:imgsArr
        })
        await newResearch.save();

        res.status(200).json({mes:"เพิ่มงานวิจัยใหม่แล้ว"});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side!"});
        console.log(error);
    }
}

exports.getAllResearch = async (req,res) => {
    try {
        const data = await researchModel.find();
        res.status(200).json({data});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side!"});
        console.log(error);
    }
}

exports.deleteResearch = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id)return res.status(400).json({err:"ไม่พบข้อมูล"});
        const research = await researchModel.findOne({_id:id});
        if(!research)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const delImgs = research.imgs.filter((item) => item.startsWith("i"));
        if(delImgs.length > 0){
            delImgs.map(async (item) => {
                await fs.unlink("./uploads/"+item,(err) => {
                    if(err)throw err;
                })
            })
        }

        const del = await researchModel.findByIdAndDelete(id);
        if(!del)return res.status(400).json({err:"ไม่สามารถลบข้อมูลได้"});

        res.status(200).json({mes:"ลบข้อมูลงานวิจัยแล้ว"});

    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side!"});
        console.log(error);
    }
}

exports.updateResearch = async (req,res) => {
    try {;
        const {title,author,objective,source,herbs_id,
            year,imgs,oldImg,views,likes,dislikes
        } = req.body;
        console.log("🚀 ~ exports.updateResearch= ~ req.body:", req.body)
        if(!title || !author || !objective || !source || !herbs_id || !year)
            return res.json({err:"ข้อมูลไม่ถูกต้อง"}).status(400);

        const id = req.params.id
        if(!id)return res.json({err:"ไม่พบข้อมูล"}).status(400);

        const research = await researchModel.findOne({_id:id});
        if(!research)return res.json({err:"ไม่พบข้อมูล"}).status(400);

        const oldArr = typeof(oldImg) === "string" ? oldImg.split(",") : oldImg;
        if(oldArr.length > 0){
            oldArr.map(async item => {
                await fs.unlink("./uploads/"+item,(err) => {if(err)return console.log(err)})
            })
        }

        let imgArr = [];
        const normalImgsArr = typeof(imgs) === "string" ? imgs.split(",").filter((item) => item !== "") : imgs;
        console.log("🚀 ~ exports.updateResearch= ~ normalImgsArr:", normalImgsArr)
        if(req.files){
            imgArr = [...normalImgsArr,...req.files.map((item) => item.filename)];
        }else{
            imgArr = imgs;
        }
        
        const update = await researchModel.findOneAndUpdate({_id:id},{
            title,author,objective,source,year,
            herbs_id:typeof(herbs_id) === 'string' ? herbs_id.split(",") : herbs_id,
            imgs:imgArr,views,likes,dislikes
        })
        if(!update)return res.json({err:"ไม่สามารถบันทึกข้อมูลได้"}).status(400);

        res.status(200).json({mes:"บันทึกข้อมูลแล้ว"});

    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side!"});
        console.log(error);
    }
}

exports.updateViews = async (req,res) => {
    try {
        const _id = req.body._id;
        if(!_id)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const update = await researchModel.findByIdAndUpdate({_id},req.body);
        if(!update)return res.status(400).json({err:"ไม่สามารถบันทึกข้อมูลได้"});
        res.status(200).json({mes:"บันทึกข้อมูลแล้ว"});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side!"});
        console.log(error);
    }
}