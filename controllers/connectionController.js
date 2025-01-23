
import connectionModel from "../models/connectionModel.js";
import userModel from "../models/UserModel.js";
import mongoose, { connect } from "mongoose";
import { safeDataGeneral } from "../utils.js";

// Send Connection API
export const SendConnectionRequest = async (req, res) => {
    try {
        if(!req.user){
            return res.status(400).send({message: "unathorized user "})
        }
        const toUserIdString = req.params.toUserId;
        const status = req.params.status;
        const fromUserId = req.user._id;
        const allowedStatus = ["interested", "ignored"];

        // Convert toUserIdString to ObjectId
        const toUserId = mongoose.isValidObjectId(toUserIdString)
            ? new mongoose.Types.ObjectId(toUserIdString)
            : null;
        

        console.log("Type of fromUserId:", typeof fromUserId); // Expecting 'object'
        console.log("Type of toUserId:", typeof toUserId); // Expecting 'object'

        if (!toUserId || !fromUserId || !status) {
            return res.status(400).send({
                message: "Something is missing!",
                fromUserId,
                toUserId: toUserIdString,
                status,
            });
        }

        if (!allowedStatus.includes(status)) {
            return res.status(400).send({ message: "Status is not valid" });
        }

        if (toUserId.equals(fromUserId)) {
            return res.status(400).send({
                message: "You cannot send a request to yourself",
            });
        }

        const userToSendRequest = await userModel.findById(toUserId);
        if (!userToSendRequest) {
            return res.status(400).send({ message: "No such user exists" });
        }

        const connectionRequest = await connectionModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (connectionRequest) {
            return res.status(400).send({
                message: "Connection request already exists",
            });
        }

        const newConnection = new connectionModel({
            toUserId,
            fromUserId,
            status,
        });

        const data = await newConnection.save();
        return res
            .status(200)
            .send({ message: "Connection request sent successfully!", data });
    } catch (error) {
        return res.status(500).send({
            message: "Error sending request",
            error: error.message,
        });
    }
};
// review connection api
export const ReviewConnectionRequest = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ message: "Unauthorized user" });
        }

        const logedInUserId = req.user._id;
        const requestId = req.params.requestId;
        const status = req.params.status;
        const allowedStatus = ["accepted", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).send({ message: "Invalid status code!" });
        }

        // Fetch the connection request
        const connectionData = await connectionModel.findOne({
            _id: requestId,
            status: "interested",
            toUserId: logedInUserId,
        });

        console.log(connectionData, "connectionData");

        if (!connectionData) {
            return res.status(404).send({ message: "No connection request found!" });
        }

        // Update the status
        connectionData.status = status;
        const data = await connectionData.save();

        return res.status(200).send({
            message: "Connection request updated successfully!",
            data: data,
        });
    } catch (error) {
        return res.status(500).send({
            message: "Error updating connection request",
            error: error.message,
        });
    }
};

// fetch all connection req for logedin user 
export const fetchAllRequest = async (req, res) => {
    try {
        // Ensure the user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).send({ message: "Unauthorized user" });
        }

        const logedInUserId = req.user._id;

        // Fetch connection requests
        const connectionData = await connectionModel.find({
            toUserId: logedInUserId,
            status: "interested",
        }).populate("fromUserId", safeDataGeneral);

        // Handle no data found
        if (!connectionData || connectionData.length === 0) {
            return res.status(200).send({ message: "No connection data available", data: connectionData });
        }

        // Success response
        return res.status(200).send({
            message: "Data fetched successfully!",
            data: connectionData,
        });
    } catch (error) {
        // Error response
        return res.status(500).send({
            message: "Error in fetching all requests",
            error: error.message,
        });
    }
};

// fetch all the peope they can message or which mean they have accepted the request or other have accepted that means their connections 
export const fetchAllConnections = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send({ message: "Unauthorized user!!!" });
      }
  
      const loggedInUser = req.user._id; // Extract the user ID
      const connectionData = await connectionModel
        .find({
          $or: [
            { toUserId: loggedInUser, status: "accepted" },
            { fromUserId: loggedInUser, status: "accepted" },
          ],
        })
        .populate("toUserId", safeDataGeneral)
        .populate("fromUserId", safeDataGeneral);
  
      // Use a Set to store unique user IDs
      const dataToTransfer = new Set();
  
      connectionData.forEach((element) => {
        if (!element.toUserId._id.equals(loggedInUser)) {
          dataToTransfer.add(element.toUserId);
        } else {
          dataToTransfer.add(element.fromUserId);
        }
      });
  
      // Convert Set to Array for transfer
      const dataArray = Array.from(dataToTransfer);
  
      return res
        .status(200)
        .send({ message: "All users are fetched successfully!!!!", data: dataArray });
    } catch (error) {
      console.error("Error in fetchAllConnections:", error);
      return res.status(500).send({
        message: "Error in fetching all connections",
        error: error.message,
      });
    }
  };
  