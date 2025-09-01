const express=require("express");
const PORT=8080;
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");
dotenv.config();
const app=express();
const User=require("./routes/userRouter")
const Post=require("./routes/postRouter");
const Comment=require("./routes/commentRouter");
app.use(express.json());
app.use(cors());
const main=async()=>{
    await mongoose.connect(process.env.MONGO_URL).then(console.log("MondoDB connected"))
    .catch((e)=>console.log("error in mongoDB :",e.message));
}
app.use(User)
app.use(Post);
app.use(Comment);

app.listen(PORT,(req,res)=>{
    console.log("Server is Learning in PORT",PORT);
    main();
})
