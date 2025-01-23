
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/database.js';
import authRouter from './routes/authRouter.js';
import registrationRouter from './routes/registrationRouter.js';
import cookieParser from "cookie-parser";
import userRouter from './routes/userRouter.js';
import connectionRouter from './routes/connectionRouter.js';



const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "http://192.168.1.105:5173", "http://52.66.244.89/"],
    credentials: true
}));

// Middleware

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/' , authRouter);
app.use("/", registrationRouter);
app.use("/", userRouter);
app.use("/", connectionRouter);
connectDB()
    .then(() => {
        console.log("connected to the DB ")
        app.listen(3000, () => {
            console.log("listening on port 3000....");
        })
    }).catch((error) => {
        console.log(error)
    })




