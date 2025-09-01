const mongoose=require("mongoose");
const Post=require("./post");
const Education=require("./education");
const Work=require("./work");
const Connection=require("./connection");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    education:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Education",
    },
    profile:{
        type:String,
    },
    work:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Work"
    }],
    post:[{
       type:mongoose.Schema.Types.ObjectId,
        ref:"Post" 
    }],
    connection:[{
       type:mongoose.Schema.Types.ObjectId,
        ref:"Connection" 
    }]
})

const User=mongoose.model("User",userSchema);
module.exports=User;