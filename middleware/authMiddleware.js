// import jwt from "jsonwebtoken"
// import userModel from "../models/UserModel.js"

// export const verfyUser = async(req, res, next) => {
//     try{
//         const {token} = req.cookies;
//         if(!token) {
//             throw new Error("invalid token ")
//         }
//         const decodedObj = await jwt.verify(token, process.env.JWTCODE);
//         const {_id} = decodedObj;
//         const user = await User.findById(_id)
//         if(!user){
//             throw new Error("user not found")
//         }
//         req.user = user;
//         next();
//     }catch(err){
//         res.status(400).send("error occur" + err.message );
//     }
// }

import jwt from "jsonwebtoken"
import userModel from "../models/UserModel.js"

export const verfyUser = async(req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(400).send({message:"no token available"})
        }
        const decodedObj = await jwt.verify(token, process.env.JWTCODE );
        const {_id} = decodedObj
        const user = await userModel.findById(_id)
        if(!user){
            return res.status(400).send({message: "no user found "})
        }
        req.user = user
        next()
    }catch(error){
        return res.status(400).send({message:"error verfiying user ", error: error})
    }
}