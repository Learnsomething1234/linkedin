const mongoose=require("mongoose");
const User=require("./user")
const connectionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    accept:{
        type:Boolean
    },
    sendRequest:{
        type:Boolean
    }
})
module.exports=mongoose.model("Connetion",connectionSchema)