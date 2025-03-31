const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    content:String,
    user_id:String,
    report:[String],
    likes:[String],
    dislikes:[String],
    replyId:[String]
},{timestamps:true});

module.exports = commentModel = mongoose.model("comments",commentSchema);