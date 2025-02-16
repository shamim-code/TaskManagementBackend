const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    otp:{type: String, default:'null'},
    otpStatus:{type:String, default:'false'},
    password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
