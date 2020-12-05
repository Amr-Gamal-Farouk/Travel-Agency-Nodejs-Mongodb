const mongoose=require('mongoose');

const Post=mongoose.model('Post',{
    creatorUserId:{
        type:String,
        required:true
    },
    postContent:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    commentsId:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
})
module.exports=Post;