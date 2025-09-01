const mongoose=require("mongoose");
const User=require("./user");

const workSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    pastworks:[{
        company:{
            type:String,
        },
        position:{
            type:String,
        },
        years:{
            type:Number,
        }
        
    }],
    present:{
        pcompany:{
            type:String,
           
        },
        pposition:{
            type:String,
           
        }
    }
})
module.exports=mongoose.model("Work",workSchema)