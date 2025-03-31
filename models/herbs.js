const mongoose = require('mongoose');

const herbSchema = mongoose.Schema({
    name_th:String,
    name_science:String,
    name_normal:String,
    herbs_look:String,
    categories:[String],
    usage:String,
    benefits:String,
    imgs:[String],
    comment_id:[String]
},{timestamps:true})

module.exports = herbModel = mongoose.model('herbs',herbSchema);