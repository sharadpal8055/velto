
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/connectdb.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Authrouter from './routes/auth.route.js'
import userrouter from './routes/user.route.js'
import resumerouter from './routes/resume.route.js'
import paymentRouter from './routes/payment.route.js'

const app=express()

const allowedOrigins = (
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173')
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Origin is not allowed by CORS.'))
  },
  credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth',Authrouter)
app.use('/api/user',userrouter)
app.use('/api/resume',resumerouter)
app.use('/api/payment',paymentRouter)

const PORT=process.env.PORT ||8055






app.get("/",(req,res)=>{
  return res.json({message:"server started"})
})

app.listen(PORT,()=>{
  console.log(`server is running at port ${PORT}`)
  connectDB()
})