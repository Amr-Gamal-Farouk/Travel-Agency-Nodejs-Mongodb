// const { Number } = require('mongodb')
const mongoose = require('mongoose')

const offer = mongoose.model('offers',{
    offer_title:{
        type:String,
        required:true,
    },
    offer_city:{
        type:String,
        required:true,
    },
    offer_dateFrom:{
        type:String,
        required:true,
    },
    offer_dateTo:{
        type:String,
        required:true,
    },
    offer_guestTotalNo:{
        type:Number,
        required:true,
    },
    offer_guestCurrentNo:{
        type:Number,
        default:0
    },
    company_ID :{
      type:String,
      required:true
    },
    user_ID:{
        type:[],
        default:[]
    },
    tripCost:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['Avilable','Closed'],
        default:'Avilable'
    }
})

module.exports=offer