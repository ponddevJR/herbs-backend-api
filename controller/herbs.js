const herbModel = require('../models/herbs');
const fs = require('fs');

exports.addHerb = async (req,res) => {
    try {
        const {name_th,name_science,name_normal,herbs_look,usage,benefits,categories,imgs} = req.body;
        console.log("🚀 ~ exports.addHerb= ~ imgs:", imgs)
        let imgsArr = [];
        if(req.files){
            imgsArr = [...req.files.map((item) => item.filename),...imgs?.split(","),];
        }else{
            imgsArr = imgs;
        }

        // ตรวจสอบสมุนไพรซ้ำ
        const herbRepeat = await herbModel.findOne({name_th});
        if(herbRepeat)return res.json({err:"มีชื่อสมุนไพรนี้ในระบบแล้ว"}).status(400);

        const newHerb = new herbModel({
            name_th,name_science,name_normal,herbs_look,
            categories:typeof(categories) === 'string' ? categories.split(",") : categories,usage,benefits,imgs:imgsArr
        })
        await newHerb.save();
        res.status(200).json({mes:"บันทึกสมุนไพรใหม่แล้ว"});

    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side!"});
        console.log(error);
    }
}

exports.getAllHerbs = async (req,res) => {
    try {
        const herbs = await herbModel.find();
        res.status(200).json({herbs});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side!"});
        console.log(error);
    }
}

exports.deleteHerb = async (req,res) => {
    try {
        const id = req.params.id.split(":")[1];
        if(!id)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const herb = await herbModel.findOne({_id:id});
        if(!herb)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const fileImgs = herb.imgs.filter((item) => item.startsWith('i'));
        // ลบรูปในโฟลเดอร์อัปโหลด
        if(fileImgs.length > 0){
            fileImgs.map( async (item) => {
                await fs.unlink("./uploads/"+item,(err) => {
                    if(err)return console.log(err);
                })
            })
        }
        // ลบข้อมูล
        await herbModel.findByIdAndDelete({_id:id});
        res.status(200).json({mes:"ข้อมูลถูกลบออกจากระบบ"})


    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side!"});
        console.log(error);
    }
}

exports.updateHerb = async (req,res) => {
    try {
        const {_id,name_th,name_science,name_normal,herbs_look,usage,benefits,imgs,categories,oldimgs} = req.body;
        const getOldImg = typeof(oldimgs) === 'string' ? oldimgs.split(",") : oldimgs;
        // ลบรูปภาพเดิม
        if(getOldImg.length > 0){
            getOldImg.forEach( async (item) => {
                await fs.unlink("./uploads/"+item,(err) => {
                    if(err)return console.log(err);
                })
            });
        }
        let imgArr;
        if(req.files){
            imgArr = [...imgs.split(","),...req.files.map(item => item.filename)];
        }else{
            imgArr = imgs;
        }

        const update = await herbModel.findOneAndUpdate({_id},{
            name_th,name_science,name_normal,herbs_look,usage,benefits,imgs:imgArr,
            categories:typeof(categories) === 'string' ? categories.split(",") : categories
        },{new:true});
        if(!update)return res.json({err:"ไม่สามารถบันทึกข้อมูลได้"}).status(400);

        res.status(200).json({mes:"บันทึกการแก้ไขข้อมูลแล้ว"});

        
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side!"});
        console.log(error);
    }
}