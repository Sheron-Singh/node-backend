import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
})) 

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"})) //get data from url and extended true for object inheritance(object ke andar object)

app.use(express.static("public")) //files images strore krne ke liye local 
app.use(cookieParser()) 


// routes import
import userRouter from './routes/user.routes.js'


// routes declaration
app.use("/api/v1/users", userRouter)

// http://localhost:3000/api/v1/users/register



export { app }