const mongoose = require('mongoose');
const CompanyUser = mongoose.model('Company', {
    CompanyName:{
        type:String,
        required:true,
        unique: true
        
    },
    address:{
        type:String,
        required:true,
       
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    rate:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true
    }
 });

 module.exports = CompanyUser;