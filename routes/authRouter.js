// const express = require("express");
import express from "express";
// const { googleAuthSignUp } = require("../controllers/authController");
import { googleAuthSignUp, MailAuthSignIn, MailAuthSignUp } from "../controllers/authController.js";
const authRouter = express.Router();

authRouter.post("/auth/google", googleAuthSignUp);
authRouter.post('/auth/mail/signUp', MailAuthSignUp);
authRouter.post('/auth/mail/SignIn', MailAuthSignIn)

// module.exports = authRouter;
export default authRouter;
