// const mongoose = require("mongoose");
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

// require("dotenv").config();
const connectDB = async () => {
    await mongoose.connect(process.env.DATABASE_URL);
}

// module.exports = connectDB
export default connectDB;