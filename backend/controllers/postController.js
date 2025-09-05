const User=require("../models/user");
const Work=require("../models/work");
const Connection=require("../models/connection")
const Post=require("../models/post");

const createPost = async (req, res) => {
  const { token, body, description, imageUrl } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    console.log(id);
    if (!user) return res.json({ message: "user not found" });

    const post = new Post({
      userId: user._id,
      body,
      description,
      imageUrl, 
      createdAt: Date.now(),
    });

    await post.save();
    await User.findByIdAndUpdate(user._id, { $push: { post } });

    return res.json({ message: "Post is created", post });
  } catch (e) {
    console.log("error during post creating", e.message);
    return res.json({ error: e.message });
  }
};


const updatePost = async (req, res) => {
  const { token, body, description, imageUrl } = req.body;
  const { postId, id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.json({ message: "user not found" });

    let post = await Post.findById(postId);
    if (!post) return res.json({ message: "Post not found" });

    await post.updateOne({
      body,
      description,
      imageUrl, // ✅ update imageUrl too
      updatedAt: Date.now(),
    });

    return res.json({ message: "Post updated", post });
  } catch (e) {
    console.log("error during post updating", e.message);
    return res.json({ error: e.message });
  }
};


const deletePost=async(req,res)=>{
    const {postId,id}=req.params;
    try{
        const user=await User.findById(id);
        if(!user) return res.json({message:"user not found"});
        let post=await Post.findById(postId);
        if(!post) return res.json({message:"Post not found"});
        if(user._id.equals(post.userId)){
        await post.deleteOne();
        await User.findByIdAndUpdate(
  user._id,
  { $pull: { post: postId } }
);

        return res.json({message:"Post is deleted"});
}else{
    return res.json({message:"you dont have delete"});
}
    }catch(e){
        console.log("error during post updating",e,message);
        return res.json({error:e.message})
    }
}

// POST /post/:postId/like
const likes = async (req, res) => {
  const { postId } = req.params;
  const { token, action } = req.body; // action = 'like' or 'unlike'

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ error: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (action === "like") {
      post.likes += 1;
    } else if (action === "unlike") {
      post.likes = Math.max(0, post.likes - 1); // prevent negative likes
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await post.save();

    return res.json({ likes: post.likes });
  } catch (e) {
    console.error("Error toggling like:", e.message);
    return res.status(500).json({ error: e.message });
  }
};



const fetchallPost=async(req,res)=>{
    try{
        const post=await Post.find({}).populate("userId");
return res.json(post);
    }catch(e){
      console.log("error during the post fetching",e.message);
      return res.json({error:e.message});
    }
}

const fetchpost=async(req,res)=>{
    const {postId}=req.params;
    
    try{
        let post=await Post.findById(postId).populate("userId comment");
        if(!post) return res.json({message:"Post not found"});
        return res.json(post)
    }catch(e){
      console.log("error during the post fetching",e.message);
      return res.json({error:e.message});
    }
}

module.exports={createPost,updatePost,deletePost,likes,fetchallPost,fetchpost};

