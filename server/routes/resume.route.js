import express from "express";
import { analyzeResume, finishInterview, generatequestions, submitAnswer } from "../controller/resume.controller.js";
import isAuth from "../middleware/isauth.js";
import upload from '../middleware/multer.js'

const resumerouter = express.Router();
resumerouter.post(
  "/analyze",
isAuth,
  upload.single("resume"),
  analyzeResume
);
resumerouter.post('/generate-questions',isAuth,generatequestions)

resumerouter.post('/submit-answers',isAuth,submitAnswer)
resumerouter.post('/finish-interview',isAuth,finishInterview)
export default resumerouter;