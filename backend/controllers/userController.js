const mongoose=require("mongoose");
const User=require("../models/user");
const Work=require("../models/work");
const Connection=require("../models/connection")
const bcrypt=require("bcrypt");
const crypto=require("crypto");
const Education=require("../models/education");
const work = require("../models/work");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");


const signup=async(req,res)=>{
    const {name,username,email,password}=req.body;
   
    try{
        if(name==""||username==""||email==""||password==""){
            return res.json({message:"All fields are required"});
        }
        
        const user1=await User.findOne({email})
        if(user1) return res.json({message:"email already exists"})
        const user2=await User.findOne({username})
        if(user2) return res.json({message:"username already exits"})
         const hashPassword=await bcrypt.hash(password,10);
    
        const newUser=new User({
            name:name,
            email:email,
            username:username,
            profile:"https://res.cloudinary.com/dl4izb2hd/image/upload/v1756632306/download_t1u1ny.png",
            password:hashPassword
        })
        await newUser.save();
        console.log(newUser);
        return res.json({message:"User Register SuccessFull"});


    }catch(e){
        console.log("error during signup",e.message);
        return res.json({error:e.message})

    }
}

const login=async(req,res)=>{
    const {username,password}=req.body;
    try{
        const user=await User.findOne({username});
        if(!user) return res.json({message:"User not found"})
        const matchPassword=await bcrypt.compare(password,user.password);
        if(!matchPassword) return res.json({message:"invalid Password"});
        const token=crypto.randomBytes(16).toString("hex");
        const data=await User.findByIdAndUpdate(user._id,{$set:{token:token}});
        return res.json({message:"Login Successfull",data})
    }catch(e){
        console.log("error during signup",e.message);
        return res.json({error:e.message})
    }
}

const userEducation=async(req,res)=>{
    const {school,degree,college}=req.body;
     const {userId}=req.params;
    const name=school.name;
    const year=school.year;
    const dname=degree.dname;
    const dyear=degree.dyear;
    const dmarks=degree.dmarks;
    const cname=college.cname;
    const cmarks=college.cmarks;
    const cyear=college.cyear;
    const marks=school.marks;
    try{
        const user=await User.findById(userId);
        if(!user) return res.json({message:"user not found"});
        const school={name,year,marks};
        const college={cname,cyear,cmarks};
        const degree={dname,dyear,dmarks};
        const educ=new Education({
            school,
            college,
            degree,
        });
        await educ.save();
        await User.findByIdAndUpdate(user._id,{$set:{education:educ}});
        return res.json({message:"Studies are saved",educ})

    }catch(e){
        console.log("error during eduction",e.message);
        return res.json({error:e.message});
    }
}

const createWork = async (req, res) => {
  const { token, present } = req.body;  // present should contain pcompany and pposition
  const { userId } = req.params;

  try {
    // Find the user by userId and populate the work field
    console.log(present);
    const user = await User.findById(userId).populate("work");
    if (!user) return res.json({ message: "User not found" });

    // Check if the user already has a work record
    let workRecord1 = await Work.findOne({ userId: userId });
    if (workRecord1) {
      // If work record exists, update the present field
      workRecord1 = await Work.findByIdAndUpdate(workRecord1._id, { $set: { present: present } }, { new: true });
    } else {
      // If no work record exists, create a new one
      workRecord1 = new Work({
        userId: user._id,
        present: present,  // Save the present field here
      });
      await workRecord1.save();
    }

    // Push the work record's _id to the user's work array
    user.work.push(workRecord1._id);
    await user.save();  // Save the updated user document

    // Fetch the updated user document with populated work
    const updatedUser = await User.findById(user._id).populate("work");

    // Respond with the success message and updated data
    return res.json({
      message: "Present Work is saved and added to the User",
      user: updatedUser,
      workRecord1
    });
  } catch (e) {
    console.log("Error during Present Work:", e.message);
    return res.json({ error: e.message });
  }
};



const addWork = async (req, res) => {
  const { pastworks } = req.body;
  const {userId}=req.params;
  

  try {
    const user = await User.findById(userId).populate("work");
    console.log(pastworks);
    if (!user) return res.json({ message: "User not found" });

    let workRecord = await Work.findOne({ userId: userId });

    if (workRecord) {
      // Push all pastworks sent from frontend
      workRecord.pastworks.push(...pastworks);
    } else {
      workRecord = new Work({
        userId: user._id,
        pastworks: pastworks,
      });
    }
  console.log(user)
    await workRecord.save();
    await User.findByIdAndUpdate(user._id,{$push:{work:workRecord._id}});
    console.log((await User.findByIdAndUpdate(user._id,{$push:{work:workRecord._id}})))
    return res.json({ message: "Past Work is added successfully",workRecord,user});

  } catch (e) {
    console.log("Error during adding past work:", e.message);
    return res.status(500).json({ error: e.message });
  }
};




const fetchUser = async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ error: 'Missing user ID' });
  }

  try {
    const user = await User.findById(userId)
      .populate('education')
      .populate('work')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      profile:user.profile,
      username:user.username,
      education: user.education,
      work: user.work, 
      // if 'work' is an array field, adjust accordingly
    });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: error.message });
  }
};



const updateProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_profiles", 
    });

  
    fs.unlinkSync(req.file.path);

   // Save URL to user profile
    await user.updateOne({ profile: result.secure_url });

    return res.status(200).json({
      message: "Profile image updated",
      profile: result.secure_url,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({ error: error.message });
  }
};






const fetchAllUsers=async(req,res)=>{
    try{
        const users=await User.find({});
        return res.json(users);
    }catch (e) {
        console.log("Error during fetching user", e.message);
        return res.status(500).json({ error: e.message });
    }
}
// const connectSend=async(req,res)=>{
//     const {id,sendRequest}=req.body;
//     try{
//         const user=await User.findById(id);
//         if (!user) return res.json({ message: "User not found" });
//         let connection=await Connection.findOne({userId:id});
//         if(connection){
//             await connection.updateOne({sendRequest:!sendRequest});
//         }else{
//             connection=new Connection({
//                 userId:id,
//                 sendRequest:!sendRequest
//             })
//         }
//         await connection.save();
//         return res.json({message:"Request is sent ",connection})

        
//     }catch (e) {
//         console.log("Error during sendingRequest", e.message);
//         return res.status(500).json({ error: e.message });
//     }

// }

// const acceptRequest=async(req,res)=>{
//     const {id,accept}=req.body;
//     try{
//         const user=await User.findById(id);
//         if (!user) return res.json({ message: "User not found" });
//         let connection=await Connection.findOne({userId:id});
//         if(connection){
//             await connection.updateOne({accept:!accept});
//         }else{
//             connection=new Connection({
//                 userId:id,
//                 accept:!accept
//             })
//         }
//         await connection.save();
        
//        if(accept==true) return await User.findByIdAndUpdate(user._id,{$push:{connection:connection}});
//         return res.json({message:"Request is sent ",connection})

        
//     }catch (e) {
//         console.log("Error during sendingRequest", e.message);
//         return res.status(500).json({ error: e.message });
//     }

// }




module.exports={signup,login,userEducation,createWork,addWork,fetchUser,fetchAllUsers,updateProfile
}