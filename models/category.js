const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    ctg_name:String,
    ctg_description:String
},{timestamps:true});

module.exports = mongoose.model('categories',categorySchema);