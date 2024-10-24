const mongoose = require("mongoose");
const shortid = require('shortid');

const Url = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
      },
      shortUrl: {
        type: String,
        required: true, 
        default: shortid.generate,
      },
      expirationDate: {
        type: Date,
        default: null,
      },
      qrCode: {
        type: String,
        required: false,
      },
      clicks: {
        type: Number,
        default: 0,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },  
});
const UrlModel = mongoose.model("Url", Url);
module.exports = UrlModel;