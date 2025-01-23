import express from 'express';
import { verfyUser } from '../middleware/authMiddleware.js'; 
import { UserRegistration } from '../controllers/registrationController.js';

const registrationRouter = express.Router();

// Use PATCH for updating registration data
registrationRouter.patch('/register', verfyUser, UserRegistration);

export default registrationRouter;
