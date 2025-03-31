const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    profile: {
        fname: String,
        lname: String,
        email: String,
        phone: String,
        profile_img: {type:String,Default:"https://cdn.pixabay.com/photo/2017/07/18/23/23/user-2517433_640.png"}
    },
    address: {
        province: String,
        amphure: String,
        sub_dis: String,
        zip_code: String
    },
    status: Boolean,
    role: String,
    email_verify: Boolean,
    status_updated_at: { type: Date, default: Date.now, index: { expires: '5d' } } // TTL Index
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);
