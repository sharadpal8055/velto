import express from "express";
import isAuth from "../middleware/isauth.js";
import { getCurrentUser } from "../controller/user.controller.js";


const userrouter = express.Router();

userrouter.get('/current-user',isAuth,getCurrentUser)

export default userrouter;