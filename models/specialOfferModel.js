const mongoose=require('mongoose');

const specialOffer=new mongoose.Schema({
    userId:{
        type:String,
        require:true,
    },
    city:{
        type:String,
    },
    HotelName:{
        type:String
    },
    rate:{
        type:Number
    },
    dateFrom:{
        type:Date
    },
    dateTo:{
        type:Date
    },
    optionBusInfo:{
        type:Object
    },
    personNumber:{
        type:Number
    },
    companiesResponse:{
        type:Array
    }

});
module.exports  =SpecialOffer=mongoose.model("specialOffer",specialOffer);
