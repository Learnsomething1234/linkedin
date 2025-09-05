const mongoose=require("mongoose");
const User=require("./user")
const connectionSchema=new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted'],
    default: 'pending'
  },
})
module.exports=mongoose.model("Connetion",connectionSchema)