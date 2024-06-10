import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectDB from "./Database/Config.js";
import UserRouter from './Routers/UserRouter.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
ConnectDB();

const port = process.env.PORT;
//Default Route
app.get("/",(req,res)=>{
    res.status(200).send("API is running");
});

app.use('/api/user',UserRouter);


app.listen(port,()=>{
    console.log("App is running");
});
