const {Router}=require('express');
const CompanyUserRouter=Router();
const CompanyUser=require("../models/companyUser");
// hash password by bcrypt lib
const bcrypt=require('bcrypt');
const saltRounds=10;

// Company Sign Up
CompanyUserRouter.post('/signup',async(req, res)=> {
    try{
    const {body}=req;
    // hash funcation to hash password
    const salt=await bcrypt.genSalt(saltRounds)
    const hashPassword=await bcrypt.hash(body.password,salt)
    body.password=hashPassword

    const user =new CompanyUser(body)
   const saveUser=await user.save()
        res.status(201).json(saveUser)
    }catch{
        res.status(400).json({status:'Not Found'})
    }

  })
//update user by Email
CompanyUserRouter.put('/update',async(req, res)=> {
    try{
    const {body}=req;
    if(body.password){
    const salt=await bcrypt.genSalt(saltRounds)
    const hashPassword=await bcrypt.hash(body.password,salt)
    body.password=hashPassword
  }
    const updatePassword=await CompanyUser.update({email:body.email},{$set:{password:body.password}});
        res.status(201).json({msg:"Done"})

    }catch{
        res.status(400).json({status:'can not update'})
    }

  })
//
CompanyUserRouter.get('/',(req,res)=>{
    CompanyUser.find({})
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch((err)=>{
        res.status(400).json(err)
    })
  })
// Company Sign In
CompanyUserRouter.post('/signin', async (req, res) => {
    const { body } = req;

    let data = await CompanyUser.findOne({ email: body.email });
    if (data != null) {
        //email founded
        const cmp = await bcrypt.compare(body.password, data.password);
        if (cmp) {
            //correct pass and email
            data.password = ""
            console.log(data.password, "pass")
            res.status(200).json(data);
        } else {
            res.status(400);
            res.send({ msg: "wrong  password" })
        }
    } else {
        // wrong email and password
        res.status(400);
        res.send({ msg: "wrong email and password" })
    }
});


module.exports = CompanyUserRouter;

//check user
async function checkUser(username, password) {
    //... fetch user from a db etc.

    const match = await bcrypt.compare(password, user.passwordHash);

    if(match) {
        //login
    }

    //...
}
