const mongoose = require("mongoose");

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        private: true,
        minlength: 8,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;