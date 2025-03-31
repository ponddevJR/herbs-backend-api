const mongoose = require("mongoose");

const newsSchema = mongoose.Schema({
    title:String,
    content:String,
    img_url:[String],
    herbs_id:[String],
    comment_id:[String],
    likes:[String],
    views:{type:Number,default:0},
    dislikes:[String]

},{timestamps:true});

module.exports = newsModel = mongoose.model('news',newsSchema);