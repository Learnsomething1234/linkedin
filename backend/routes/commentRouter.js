
const express=require("express");
const router=express.Router();
const {createComment,deleteComment,fetchComment}=require("../controllers/commentController");

router.post("/:id/createcomment/:postId",createComment);
router.delete("/:id/:postId/:commentId/deleteComment",deleteComment);
router.get("/:postId/getcomment",fetchComment)

module.exports=router;