import  mongoose from "mongoose";

const user_Schema = mongoose.Schema({
    user_name:String,
    user_email:String,
    password:String,
    token:String,
    role:String
})
const User = mongoose.model("User",user_Schema);

export default User;