import express from 'express'
import { verfyUser } from '../middleware/authMiddleware.js'
import { fetchAllConnections, fetchAllRequest, ReviewConnectionRequest, SendConnectionRequest } from '../controllers/connectionController.js'
const connectionRouter = express.Router()

connectionRouter.post("/request/send/:status/:toUserId", verfyUser, SendConnectionRequest)
connectionRouter.patch("/request/review/:status/:requestId", verfyUser, ReviewConnectionRequest)
connectionRouter.get("/request/fetchall", verfyUser, fetchAllRequest)
connectionRouter.get("/connection/fetchall", verfyUser, fetchAllConnections)

export default connectionRouter