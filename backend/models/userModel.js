import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
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
        unique: true,
    },
    verifyotp: {
        type: String,
        default: '',
    },
    verifyotpExpireAt: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    resetotp: 
    { type: String, 
      default: ""

     },
    resetotpExpireAt: {
        type: Number,
        default: 0,
    },},{timestamps: true});
export const User =mongoose.models.user|| mongoose.model("User", userSchema); 