const Comment=require("../models/comment")
const Post=require("../models/post");
const User=require("../models/user")

const createComment=async(req,res)=>{
    const {postId,id}=req.params;
    const {token,body}=req.body;
    try{
        const user=await User.findById(id);
        if(!user) return res.json({message:"user not found"});
        let post=await Post.findById(postId);
                if(!post) return res.json({message:"Post not found"});
        const comment=new Comment({
            userId:user._id,
            body:body,
            postId:post._id
        });
        await comment.save();
        await Post.findByIdAndUpdate(post._id,{$push:{comment:comment}}).populate("userId");
        return res.json({message:"comment is created",comment});
    }catch(e){
        console.log("error during post creating",e.message);
        return res.json({error:e.message});
    }   
}

const deleteComment=async(req,res)=>{
    const {commentId,postId,id}=req.params;
    try{
        const user=await User.findById(id);
        if(!user) return res.json({message:"user not found"});
        let post=await Post.findById(postId);
                if(!post) return res.json({message:"Post not found"});
        const comment=await Comment.findById(commentId);
        console.log(comment);
        console.log(user);
        if(user._id.equals(comment.userId)){
        await Comment.findByIdAndDelete(comment._id);
        await Post.findByIdAndUpdate(post._id,{$pull:{comment:comment._id}});

        return res.json({message:"comment is deleted"});
        }else{
            return res.json({message:"you dont have right to delete"});
        }
        
    }catch(e){
        console.log("error during post creating",e.message);
        return res.json({error:e.message})
    }
}
const fetchComment=async(req,res)=>{
    const {postId}=req.params;
    try{

        let post=await Post.findById(postId);
                if(!post) return res.json({message:"Post not found"});
        const comment=await Comment.find({postId:post._id}).populate("userId");
        return res.json(comment);
    }catch(e){
        console.log("error during post creating",e.message);
        return res.json({error:e.message})
    }

}

module.exports={createComment,deleteComment,fetchComment};