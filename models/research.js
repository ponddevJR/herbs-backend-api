const mongoose = require('mongoose');

const researchSchema = mongoose.Schema({
    title:String,
    year:Number,
    author:String,
    objective:String,
    source:String,
    views:{type:Number,default:0},
    likes:[String],
    dislikes:[String],
    imgs:[String],
    herbs_id:[String],
    comment_id:[String]
},{timestamps:true});

module.exports = mongoose.model('researchs',researchSchema);