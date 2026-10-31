
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/connectdb.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import User from './model/user.model.js'
import Authrouter from './routes/auth.route.js'
import userrouter from './routes/user.route.js'

const app=express()

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',Authrouter)
app.use('/api/user',userrouter)


const PORT=process.env.PORT ||8055
dotenv.config()






app.get("/",(req,res)=>{
  return res.json({message:"server started"})
})

app.listen(PORT,()=>{
  console.log(`server is running at port ${PORT}`)
  connectDB()
})