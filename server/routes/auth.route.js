import express from "express";
import { googleAuth, logout } from "../controller/auth.controller.js";

const Authrouter = express.Router();

Authrouter.post("/google", googleAuth);
Authrouter.get("/logout", logout);

export default Authrouter;