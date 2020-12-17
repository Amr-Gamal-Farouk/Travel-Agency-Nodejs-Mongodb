const mongoose=require('mongoose');

const Customer=mongoose.model('Customer',{
    firstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        default:Date.now
    },
    phoneNum:{
        type:String,
        required:true,
        maxlength:11   
    },
    token:{
        type:String,
        required:false
    },
    cart:{
        type:[],
        required:true
    },
    payMethod:{
        type:String,
        required:false
    },
    VCode:{
        type:Number,
    }
   
})
module.exports=Customer;




// status:{
//     type:String,
//     enum:['started','processing','done'],
//     default:'started'
// }