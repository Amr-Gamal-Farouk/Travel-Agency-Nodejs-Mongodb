const mongoose=require('mongoose');

const Comment=mongoose.model('Comment',{
    rate:{
        type:Number,
        default:0
    },
    creatorName:{
        type:String,
        required:true
    },
    commentContent:{
        type:String,
        required:true
    },
    post_id:{type:mongoose.Schema.Types.ObjectId, ref:'Post'}
})
module.exports=Comment;