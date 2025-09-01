const express=require("express");
const router=express.Router();

const {createPost, updatePost, likes, fetchallPost,fetchpost, deletePost}=require("../controllers/postController")

router.post("/createpost/:id",createPost);
router.put("/:id/updatePost/:postId",updatePost);
router.delete("/:id/deletePost/:postId",deletePost);
router.post("/post/:postId/like", likes);
router.get("/allPost",fetchallPost);
router.get("/post/:postId",fetchpost);

module.exports=router;