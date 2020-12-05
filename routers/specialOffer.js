const e = require('express');
const { Router } = require('express');
const SpecialOffer = require('../models/specialOfferModel');
const specialOffer = Router();

// 1 todo user Add special offer
specialOffer.post('/',async (req,res)=>{
    //todo input validation ---2
    //const {error}=validateSOffer(req.body);
    // if(error)
    // return res.status(400).send(error.details[0].message);
   try{ let offer= new SpecialOffer(req.body);
    let data= await  offer.save()
    if(data!=null){
        res.status(200).json(data)
    }else{
       throw "faild"
    }}catch(e){
        res.status(400).send({msg:e})
    }
   
  })
  
  // 2 todo get all user special offer
  specialOffer.get('/',async (req,res)=>{
  
    const data=await SpecialOffer.find()
    if(!data) return  res.status(404).send('no data');
    res.status(200).json(data);
  
  })
  
  // 3 todo get special offer by userId
  specialOffer.get('/:userId',async (req,res)=>{
  try {
    const data = await SpecialOffer.find({"userId": req.params.userId});
    res.status(200).json(data);
  }catch (e){
  res.status(404).json(e.message);
  }
  
  
  })
  
  // 4 todo Add company response
  specialOffer.put('/company/:offerId',async (req,res)=>{
    try {
      let data = await SpecialOffer.findById(req.params.offerId);
      if(!data) return  res.status(404).send('no data');
      data["companiesResponse"].push(req.body["companiesResponse"][0]);
      data= await SpecialOffer.findByIdAndUpdate(req.params.offerId,data);
      res.status(200).json(data);
    }catch (e){
      res.status(404).json(e.message);
    }
  
  
  })
  
  // 5 todo change user  aprove
  specialOffer.put('/user/:offerId/:companyId',async (req,res)=>{
    try {
      let data = await SpecialOffer.findById(req.params.offerId);
      if(!data) return  res.status(404).send('no data');
      let array=data["companiesResponse"];
      console.log(array);
      for(let i=0;i<array.length;i++){
        console.log(req.params.companyId)
        if(array[i]['companyid']===req.params.companyId){
          console.log("ssss");
          if(data["companiesResponse"][i]['deal']===true){
          data["companiesResponse"][i]['deal']=false;
          }else {
            console.log("aaaaaaaaa");
            data["companiesResponse"][i]['deal']=true;
          }
          data= await SpecialOffer.findByIdAndUpdate(req.params.offerId,data);
          res.status(200).json(data);
        }
      }
    }catch (e){
      res.status(404).json(e.message);
    }
  
  
  })
  
  // 6 todo delete company response
  specialOffer.delete('/company/:offerId/:companyId',async (req,res)=>{
    try {
      let data = await SpecialOffer.findById(req.params.offerId);
      if(!data) return  res.status(404).send('no data');
      let array=data["companiesResponse"];
      for(let i=0;i<array.length;i++){
        if(array[i]['companyid']===req.params.companyId){
          console.log(i);
          data["companiesResponse"].splice(i,1);
        }else {
          return  res.status(404).send('no data with companyId');
        }
  
      }
      data= await SpecialOffer.findByIdAndUpdate(req.params.offerId,data);
      res.status(200).json(data);
    }catch (e){
      res.status(404).json(e.message);
    }
  
  
  })
  
  // 7 todo delete user special offer
  specialOffer.delete('/user/:offerId',async (req,res)=>{
    try {
      let data = await SpecialOffer.findByIdAndDelete(req.params.offerId);
      if(!data) return  res.status(404).send('no data');
      res.status(200).json(data);
    }catch (e){
      res.status(404).json(e.message);
    }
  
  
  })
  module.exports = specialOffer;
  
  