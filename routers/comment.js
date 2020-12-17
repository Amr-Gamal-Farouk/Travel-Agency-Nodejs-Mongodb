const {Router}=require('express');
const GuideME=Router();
const Post = require('../models/post');
const Comment = require('../models/comment');


// api for creating post
GuideME.post('/posts',(req,res)=>{
    const{body}=req;
    const post=new Post(body);
    let x=post.save();
    x.then((post)=>{
        res.status(200).json(post);
    })
    x.catch((e)=>{
        console.log(e);
        res.status(500).json(e);
    })
});
// api for creating comments
GuideME.post('/comment', (req,res)=>{
    const{body}=req;
    const comment=new Comment(body);
    let x=comment.save();
    x.then(async (comment)=>{
       let post =  await Post.findByIdAndUpdate(
            { _id: comment.post_id },
            { $push: { commentsId: comment._id } },
            { upsert: true }
          );
          if(post){
            res.status(200).json(comment);
          }else{
            res.status(400).json({"message":"cant find postId"});
          }
    })
    x.catch((e)=>{
        console.log(e);
        res.status(500).json(e);
    })
});
// api for viewing posts
GuideME.get('/posts', async (req,res)=>{
    let x = await Post.find().populate("commentsId");
    if(x){
        res.status(200).json(x);
    }else{
        res.status(400).json({"message" : "No posts found"});
    }
});
// api for get posts by city
GuideME.get('/posts/:city', async (req,res)=>{
    let city = req.url.split('/')[2];
    console.log(city);
    let x = await Post.find({city}).populate("commentsId");
    if(x && x.length != 0){
        res.status(200).json(x);
    }else{
        res.status(400).json({"message" : "No posts found in this city"});
    }
});
// Plus or minus comment rate
GuideME.put('/comments/:commentid/:userid', async (req,res)=>{//TODO NEW
    let comment = req.params.commentid;
    const{body}=req;
    let comments = await Comment.findOne({_id:comment});
    comments.rate+= parseInt(body.rate);
    comments.userId.push(req.params.userid);//TODO NEW
    console.log( comments.rate)
    let x= await Comment.findOneAndUpdate({_id:comment},comments);
    if (x != null) {
        
        res.status(200).json(comments);//TODO NEW
    } 
    else {
        res.status(400).json(x);
    }
});
module.exports =GuideME;
