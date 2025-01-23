import connectionModel from "../models/connectionModel.js"
import userModel from "../models/UserModel.js"
import { safeData, safeDataGeneral } from "../utils.js"


export const getProfile = async (req, res) => {
    try{
        const userId = req.params.id
        const user = req.user
        if(!userId || !user || userId != user._id){
            return res.status(400).send({message: "something wrong with user identification"})
        }
        const userData = safeData(user);
        res.status(200).send({message:"successs", data: userData})
    }catch(error){
        return res.status(400).send({message:"something went wrong with fetching user data ", error: error})
    }
}

// feed api 
export const userFeed = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ message: "Unauthorized user !!!" });
        }
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit
        const skip = (page-1)*limit
        // Fetch connections
        const connectionData = await connectionModel.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ]
        }).select("toUserId fromUserId");

        // Collect hidden user IDs
        const hiddenUserFromFeed = new Set();
        connectionData.forEach((row) => {
            hiddenUserFromFeed.add(row.toUserId);
            hiddenUserFromFeed.add(row.fromUserId);
        });

        // Fetch users excluding hidden users and logged-in user
        const users = await userModel.find({
            $and: [
                { _id: { $nin: Array.from(hiddenUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(safeDataGeneral).skip(skip).limit(limit);
        // console.log("connection data ", users)
        res.status(200).send({data: users})
    }catch(error){
        return res.status(400).send({message: "Error in getting user feed !!!", error: error})
    }
}


