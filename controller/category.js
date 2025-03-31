const categoryModel = require("../models/category");

exports.addCategory = async (req,res) => {
    try {
        const {ctg_name,ctg_description} = req.body;
        if(!ctg_name || !ctg_description)
            return res.status(400).json({err:"ข้อมูลไม่ถูกต้อง"});
        // check category's allready exit
        const isRepeat = await categoryModel.findOne({ctg_name});
        if(isRepeat)
            return res.json({err:"หมวดหมู่นี้ถูกใช้แล้ว"}).status(400);
        // length for category id
        const data = await categoryModel.find();
        // add new
        const newCategory = new categoryModel({
            ctg_name,ctg_description
        })
        await newCategory.save();
        res.status(200).json({mes:"เพิ่มหมวดหมู่สมุนไพรใหม่แล้ว"})
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}

exports.getAllCategories = async (req,res) => {
    try {
        const data = await categoryModel.find();
        res.status(200).json({categories:data});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}

exports.updateCategory = async (req,res) => {
    try {
        const {_id,change_name,change_des} = req.body;
        if(!change_name || !change_des || !_id)
            return res.json({err:"ไม่พบข้อมูล"}).status(400);

        const update = await categoryModel.findOneAndUpdate({_id},{ctg_name:change_name,ctg_description:change_des},{new:true});
        if(!update)
            return res.json({err:"ไม่สามารถบันทึกข้อมูลได้"}).status(400);

        res.status(200).json({mes:"บันทึกข้อมูลแล้ว"});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}

exports.deleteCategory = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id)return res.json({err:"ไม่พบข้อมูล"}).status(400);

        const deleteCtg = await categoryModel.findByIdAndDelete(id);
        if(!deleteCtg)return res.json({err:"ไม่สามารถลบข้อมูลได้"}).status(400);

        res.status(200).json({mes:"ลบหมวดหมู่แล้ว"});
    } catch (error) {
        res.status(500).json({err:"Something went wrong at server side"});
        console.log(error);
    }
}