const mongoose = require('mongoose');

const TambonSchema = new mongoose.Schema({
    id: Number,
    zip_code: Number,
    name_th: String,
    name_en: String,
    amphure_id: Number,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date
});

const AmphureSchema = new mongoose.Schema({
    id: Number,
    name_th: String,
    name_en: String,
    province_id: Number,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
    tambon: [TambonSchema] // อำเภอมีตำบลเป็น Array
});

const ProvinceSchema = new mongoose.Schema({
    id: Number,
    name_th: String,
    name_en: String,
    geography_id: Number,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
    amphure: [AmphureSchema] // จังหวัดมีอำเภอเป็น Array
});

// Export Model
const Province = mongoose.model('Province', ProvinceSchema , 'provinces');

module.exports = Province;

