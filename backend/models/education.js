const mongoose=require("mongoose")
const User=require("./user")
const educationSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    school:{
        name:{
            type:String,
            required:true,
        },
        marks:{
            type:Number,
            required:true,
        },
        year:{
            type:Number,
            required:true
        }
    },
    college:{
        cname:{
            type:String,
            required:true,
        },
        cmarks:{
            type:Number,
            required:true,
        },
        cyear:{
            type:Number,
            required:true
        }
    },
    degree:{
        dname:{
            type:String,
            required:true,
        },
        dmarks:{
            type:Number,
            required:true,
        },
        dyear:{
            type:Number,
            required:true
        }
    }

})


module.exports=mongoose.model("Education",educationSchema)