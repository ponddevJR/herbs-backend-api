const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    user_id:String,
    text:String,
    emotion:{},
    images:[String],
    likes:[String],
    comment_id:[String],
    report:[String]
},{timestamps:true});

module.exports = blogModel = mongoose.model("blogs",blogSchema);