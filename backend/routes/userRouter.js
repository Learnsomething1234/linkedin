const express=require("express");
const router=express.Router();
const upload = require("../middleware/upload");
const {signup,login,userEducation, createWork, addWork, fetchUser, fetchAllUsers, updateProfile}=require("../controllers/userController");


router.post("/signup",signup);
router.post("/login",login);
router.post("/education/:userId",userEducation)
router.post("/presentwork/:userId",createWork)
router.post("/addpastwork/:userId",addWork);
router.get("/user/:id",fetchUser);
router.put("/profile/:id",upload.single("profile"), updateProfile)

router.get("/allusers",fetchAllUsers);
// router.post("/connectsend/:id",connectSend)
// router.post("/acceptReq/:id",acceptRequest)







module.exports=router;