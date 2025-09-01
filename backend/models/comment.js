const mongoose=require("mongoose");
const User=require("./user")
const Post=require("./post")
const commentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    },
    postId:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
    },
    body:{
        type:String,
        required:true,
    }
})
module.exports=mongoose.model("Comment",commentSchema)