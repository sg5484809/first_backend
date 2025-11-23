import dotenv from 'dotenv';
import { app } from "./app.js"
import connectDB from "./db/index.js";

dotenv.config({ path: './env' });
connectDB()

app.listen(process.env.PORT || 8000, ()=>{
    console.log("Server running on:", process.env.PORT);
})








/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express"
const app = express()
( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERRRR:",error);
            throw error
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listning on : `,`${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log("ERROR: ",error);
        throw error
    }
})()
*/