const mongoose=require("mongoose");
const User=require("./user");
const Comment=require("./comment")
const postSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    updateAt:{
        type:Date,
        default:Date.now(),
    },
    body:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
})

module.exports=mongoose.model("Post",postSchema);