const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect(`${process.env.DB_CONNECT_STRING}`);
        console.log('connected successfully!');
    } catch (error) {
        console.log(error);
    }
}
module.exports = connect;

