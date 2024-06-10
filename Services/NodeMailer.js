import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const nodeMailer = (user,token,res)=>{
var transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
      user: process.env.PASSMAIL,
      pass: process.env.PASSKEY,
  }
});

var mailOptions = {
  from:process.env.PASSMAIL,
          to:user.user_email,
          subject:"Password Reset",
          text:"You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          `https://authentication-basic-app.netlify.app/reset-password/${user._id}/${token}`
}

transporter.sendMail(mailOptions,function(error,info){
  if(error){
      console.log(error);
     return res.status(500).json({Message:"Internal Server Error"});
  }
  else{
     return  res.status(200).json({Message:"email Send Successfully"});
  }
});
}

export default nodeMailer;
