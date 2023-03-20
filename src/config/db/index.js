const mongoose = require('mongoose');

async function connect() {

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb://127.0.0.1:27017/web_nodejs');
        console.log("Connect mongodb successful!");
    } catch (error) {
        console.log("Connect mongodb failed!");
    }

}

module.exports = { connect };