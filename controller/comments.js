const commentModel = require("../models/comment");
const herbsModel = require("../models/herbs");
const researchsModel = require("../models/research");
const newsModel = require("../models/news");
const blogModel = require("../models/blogs");

exports.addComments = async (req, res) => {
    try {
        const { type, mainId, user_id, content } = req.body;
        if (!type || !mainId || !user_id || !content) {
            return res.status(400).json({ err: "ข้อมูลไม่ถูกต้อง" });
        }

        // สร้าง comment ใหม่
        const addNewComment = new commentModel({ content, user_id });
        const save = await addNewComment.save();
        const comment_id = save._id;

        if (!comment_id) {
            return res.status(400).json({ err: "ไม่สามารถเพิ่มความคิดเห็นได้" });
        }

        // เลือก model ที่จะอัปเดต
        const model = type === "herbs" ? herbsModel :
                      type === "news" ? newsModel : 
                      type === "blogs" ? blogModel :
                      researchsModel ;
        const mainData = await model.findById(mainId);
        if (!mainData) {
            await commentModel.findByIdAndDelete(comment_id);
            return res.status(400).json({ err: "ไม่สามารถเพิ่มความคิดเห็นได้" });
        }

        // อัปเดต comment_id ใน mainData
        mainData.comment_id = [...(mainData.comment_id || []), comment_id];

        const updateMain = await mainData.save();
        if (!updateMain) {
            await commentModel.findByIdAndDelete(comment_id);
            return res.status(400).json({ err: "ไม่สามารถเพิ่มความคิดเห็นได้" });
        }

        res.status(200).json({ mes: "เพิ่มความคิดเห็นแล้ว", comment_id });

    } catch (error) {
        console.error("🚀 ~ addComments error:", error);
        res.status(500).json({ err: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
    }
};


exports.getAllComments = async (req,res) => {
    try {
        const comments = await commentModel.find();
        res.status(200).json({comments});
    } catch (error) {
        console.error("🚀 ~ addComments error:", error);
        res.status(500).json({ err: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
    }
}

exports.updateComment = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id)return res.status(400).json({err:"ไม่สามารถบันทึกข้อมูลได้"});
        const update = await commentModel.findOneAndUpdate({_id:id},{...req.body});
        if(!update)return res.status(400).json({err:"ไม่สามารถบันทึกข้อมูลได้"});
        res.status(200).json({mes:"บันทึกแล้ว"});
    } catch (error) {
        console.error("🚀 ~ addComments error:", error);
        res.status(500).json({ err: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
    }
}

exports.commentReport = async (req,res) => {
    try {
        const {id,report} = req.body;
        if(!id || report.length < 1)return res.json({err:"ข้อมูลไม่ถูกต้อง"}).status(400);

        const comment = await commentModel.findOne({_id:id});
        if(!comment)return res.json({err:"ไม่พบข้อมูล"}).status(400);
        console.log("🚀 ~ exports.commentReport= ~ comment:", comment)

        const update = await commentModel.findOneAndUpdate({_id:id},{report:[...comment.report,...report]});
        if(!update)return res.json({err:"เกิดข่อผิดพลาดในการรายงาน"}).status(400);

        res.status(200).json({mes:"รายงานความคิดเห็นนี้แล้ว"});
    } catch (error) {
        console.error("🚀 ~ addComments error:", error);
        res.status(500).json({ err: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
    }
}

exports.updateContent = async (req,res) => {
    try {
        const {id,content} = req.body;
        if(!id || !content)return res.json({err:"ไม่พบข้อมูล"}).status(400);

        const update = await commentModel.findOneAndUpdate({_id:id},{content});
        if(!update)return res.json({err:"ไม่พบข้อมูล"}).status(400);

        res.status(200).json({mes:"บันทึกความคิดเห็นแล้ว"});
    } catch (error) {
        console.error("🚀 ~ addComments error:", error);
        res.status(500).json({ err: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
    }
}

exports.removeComment = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const del = await commentModel.findByIdAndDelete(id);
        if(!del)return res.status(400).json({err:"ไม่พบข้อมูล"});

        res.status(200).json({mes:"ลบความคิดเห็นนี้แล้ว"});
    } catch (error) {
        console.error("🚀 ~ addComments error:", error);
        res.status(500).json({ err: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
    }
}

exports.clearReport = async (req,res) => {
    try {
        const id = req.params.id;
        if(!id)return res.status(400).json({err:"ไม่พบข้อมูล"});

        const clear = await commentModel.findOneAndUpdate({_id:id},{report:[]});
        if(!clear)return res.status(400).json({err:"ไม่สามารถบันทึกข้อมูลได้"});

        res.status(200).json({mes:"ล้างรายงานทั้งหมดออกจากความคิดเห็นนี้"});
        
    } catch (error) {
        console.error("🚀 ~ addComments error:", error);
        res.status(500).json({ err: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
    }
}