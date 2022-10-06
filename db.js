const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/orderlocal'

const connectToDb = () => {
    mongoose.connect(uri, () => {
        console.log('connected to db');
    });
}

module.exports = connectToDb;