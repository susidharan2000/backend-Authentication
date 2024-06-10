import User from '../Models/UserSchema.js';
import bcryptjs from 'bcryptjs'
import  jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import nodemailer from '../Services/NodeMailer.js';

dotenv.config();
export const RegisterUser = async(req,res) =>{
    try{
        const {user_name,user_email,password,role} = req.body;
        const hashPassword = await bcryptjs.hash(password,10);
        const newUser = new User({user_name,user_email,password:hashPassword,role})
        await newUser.save();
        res.status(200).json({Message:"User Registered Successfully",data:newUser})
    }
    catch(error){
        console.log(error);
        res.status(500).json({Message:"Internal Server Error in register User"});
    }
}
export const LoginUser = async(req,res)=>{
    
    try{
        const {user_email,password} = req.body;
        const userDetail = await User.findOne({user_email});
        if(!userDetail){
            return res.status(401).json({Message:"User Not found"});
        }
        const passwordMatch = await bcryptjs.compare(password,userDetail.password);
        if(!passwordMatch){
            return res.status(401).json({Message:"Incorrect Password"});
        }
        //jwt token creation after sign In
        const token = jwt.sign({_id:userDetail._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
        userDetail.token = token;
        await userDetail.save();
        res.status(200).json({Message:"User logged Successfully",token:token});

    }
    catch(error){
        console.log(error);
        res.status(500).json({Message:"Internal Server Error in register User"});
    }
}

export const getUser  = async(req,res) =>{
    try{
        const userid = req.user._id;
            const user = await User.findById(userid);
            res.status(200).json({Message:"User Details",data:[user]});
        }
        catch(error){
            console.log(error);
            res.status(500).json({Message:"Internal Server Error failed to get the User"});
        }
}

export const forgotPassword = async(req,res)=>{
    const {user_email} = req.body;
    const user = await User.findOne({user_email});
    if(!user){
        return res.status(401).json({Message:"User Not found"});
    }
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"})
    
    try {
        await nodemailer(user,token,res);
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Internal Server in forget password Error" });
    }
}

export const resetPassword = async(req,res)=>{
    const {id,token} = req.params
    const {password} = req.body;
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
    if(err){
        return res.status(401).json({Message:"Invalid Token"});
    }
    else{
        bcryptjs.hash(password,10)
        .then(hash =>{
            User.findByIdAndUpdate({_id:id},{password:hash})
                .then(ele=>res.send({status:"success"}))
                .catch(err=>res.send({status:err}))
        })
        .catch(err=>res.send({status:err}))
    }
    })
}