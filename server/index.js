
import express from 'express'
import dotenv from 'dotenv'
const app=express()
const PORT=process.env.PORT ||6000
dotenv.config()
app.get("/",(req,res)=>{
  return res.json({message:"server started"})
})

app.listen(PORT,()=>{
  console.log(`server is running at port ${PORT}`)
})