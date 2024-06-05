const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        required: true
    }
})

const authModel = mongoose.model('user', authSchema);

module.exports = authModel;