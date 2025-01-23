import express from 'express';
import { verfyUser } from '../middleware/authMiddleware.js'; 
import { getProfile, userFeed } from '../controllers/userController.js';


const userRouter = express.Router();

// Use PATCH for updating registration data
userRouter.get('/fetch/user/:id', verfyUser, getProfile );
userRouter.get('/feed', verfyUser, userFeed)

export default userRouter;
