const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    dob: {
        type: String
    }
});

module.exports = mongoose.model('users', UserSchema);
