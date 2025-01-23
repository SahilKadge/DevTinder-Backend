
// const userModel = require("../models/UserModel.js");
// const axios = require("axios");
import userModel from "../models/UserModel.js";
import axios from "axios"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SaltRound = parseInt(process.env.SALTROUND);
console.log("saltround" ,SaltRound)

export const googleAuthSignUp = async (req, res) => {
  try {
    const { token } = req.body;
  

    if (!token) {
      return res.status(400).json({ status: "error", message: "Token is required" });
    }

    // Validate token with Google API
    const userInfoResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
    );
    const userInfo = userInfoResponse.data;
    console.log("Google User Info:", userInfo);

    // Search for existing user
    console.log("Finding user in database...");
    let user = await userModel.findOne({ googleId: userInfo.id });
    console.log("User found:", user);

    if (!user) {
      console.log("Creating a new user...");
      user = new userModel({
        googleId: userInfo.id,
        emailId: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        UserProfile: userInfo.picture,
      });
      await user.save();
    
      console.log("User saved successfully.");
    }
    const Ctoken = await jwt.sign({_id: user._id}, process.env.JWTCODE)
    res.cookie("token", Ctoken, {httpOnly: true});
    // Return success response
    res.status(200).json({
      status: "success",
      // registered,
      message: user.isNew ? "User registered successfully" : "User already exists",
      user: user.toObject(),
    });
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    res.status(400).json({
      status: "error",
      message: "Invalid Google token or server error",
    });
  }
};

export const MailAuthSignUp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password , SaltRound)
   
    // Find a user with the provided email
    let user = await userModel.findOne({ emailId: email });

    console.log("user", user);

    if (!user) {
      console.log("Creating a new user...");
      user = new userModel({
        emailId: email,
        password: hashedPassword,
      });

      await user.save();
      console.log("User saved successfully.");
      const token = await jwt.sign({_id: user._id}, process.env.JWTCODE)
      res.cookie("token", token, {httpOnly: true});
      
      return res.status(200).json({
        status: "success",
        message: "User registered successfully",
        user: user.toObject(),
      });
    } else {
      // Check if the user has a password
      
      const userWithPassword = !!user.password;

      if (!userWithPassword) {
        user.password = hashedPassword;
        await user.save();
        const token = await jwt.sign({_id: user._id}, process.env.JWTCODE)
        res.cookie("token", token, {httpOnly: true});
        return res.status(200).json({
          status: "success",
          message: "User updated successfully",
          user: user.toObject(),
        });
      }
    }

    // If user exists and has a password
    return res.status(200).json({
      status: "success",
      message: "User already exists",
      // user: user.toObject(),
    });
  } catch (error) {
    console.error("Error in MailAuthSignUp:", error);
    res.status(400).send({
      message: "Error in mail authentication.",
      error: error.message,
    });
  }
};

export const MailAuthSignIn = async (req, res) => {
  try{
    const {email, password} = req.body;
    const user = await userModel.findOne({emailId : email })
    if(!user){
      res.status(404).send({
        message: "no user Found"
      })
    }else{
      const validateUser = await bcrypt.compare(password , user.password);
      if(validateUser){
        const token = await jwt.sign({_id: user._id}, process.env.JWTCODE)
        res.cookie("token", token, {httpOnly: true});
        res.status(200).send({message: "log In successfully !!!! ", data: user})
      }else{
        res.status(400).send({message: "email or password incorrect !!!!"})
      }
    }

  }catch(error){
    console.error("Error in Sign In :", error);
    res.status(400).send({
      message: "Error in mail sign IN .",
      error: error.message,
    });
  }
}