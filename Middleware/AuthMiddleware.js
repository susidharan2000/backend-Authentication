//jwt middleware
import jwt from 'jsonwebtoken';
import User from '../Models/UserSchema.js';
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async(req,res,next) =>{
    const token = req.header('Authorization');
    //const token = req.headers.authorization?.split(' ')[1]; //bearer token
    if(!token){
        return res.status(401).json({Message:"Token not found"});
    }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = decode
       // console.log(req.user);
        const user = await User.findById(req.user._id);
        if(user.role !== 'admin'){
            return res.status(401).json({Message:"Access Denied",access:false});
        }
        next()
    }
    catch(error){
            console.log(error);
            res.status(500).json({Message:"Internal Server Error in Auth middleware"});
     }
}
export default authMiddleware;