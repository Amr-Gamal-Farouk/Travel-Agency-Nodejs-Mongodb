const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const customer = Router();
const saltRounds = 10;
const secretKey = "ezzat";
const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: 'ezzat.ashraf31@gmail.com', // generated ethereal user
        pass: 'zezoashrf13', // generated ethereal password
    },
});

function generatVCode() {
    return Math.floor(Math.random() * Math.floor(999999));
};

customer.post('/signup', async (req, res) => {
    const { body } = req;
    const salt = await bcrypt.genSalt(saltRounds)
    const hashPassword = await bcrypt.hash(body.password, salt)
    body.password = hashPassword
    try {
        let token = jwt.sign({ username: body.email }, secretKey);
        const vCode = generatVCode();

        body.token = token;
        body.VCode = vCode;
        const user = new Customer(body);
        let x = user.save((error, myData) => {
            if (error) {
                console.log("failedto save data")
                res.status(400).json(error.message);
            } else {
                let info = transporter.sendMail({
                    from: ' Company Name <ezzat.ashraf31@gmail.com>', // sender address
                    to: body.email,
                    subject: "verification code ",
                    text: "Your verification code is : " + vCode,

                }, (error, dtat) => {
                    if (error) {
                        console.log("Error");
                        res.status(500);
                        res.send("EmailNotSent!")
                    } else {
                        console.log("Succes");
                    }
                });
                res.status(200).json(body);
            }
        });
    } catch {
        res.status(500);
        res.send("Failed!")
    }
});

customer.post('/signin', async (req, res) => {
    const { body } = req;

    let data = await Customer.findOne({ email: body.email });
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




customer.patch('/update', async (req, res) => {
    try {
        const { body } = req;
        const { token } = body
        if(body.password){
            const salt = await bcrypt.genSalt(saltRounds)
            const hashPassword = await bcrypt.hash(body.password, salt)
            body.password = hashPassword
        }
        let data = await Customer.findOneAndUpdate({ token }, body);
        if (data != null) {
            res.status(200).json(data);
        }
        else {
            throw "failed to update"
        }
    } catch (error) {
        res.status(400);
        res.send({ errormsg: error })
    }
})




customer.post('/verify', async (req, res) => {
    const { email, VCode } = req.body;
    let userData = await Customer.findOne({ email, VCode });
    if (userData != null) {
        userData.VCode = 0;
        let data = await Customer.findOneAndUpdate({ email }, userData);
        if (data != null) {
            res.status(200).json({ msg: "Email Verified" });
        } else {
            res.status(400);
            res.send({ msg: "UpDate Not Done" })
        }

    } else {
        res.status(400);
        res.send({ msg: "Wrong VCode" })
    }
});
customer.post('/resendmail', async (req, res) => {
    const { email } = req.body;
    try {
        let userData = await Customer.findOne({ email });
        if (userData != null) {
            console.log("dddddd")
            let info = await transporter.sendMail({
                from: ' Company Name <ezzat.ashraf31@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "verification code" + userData.VCode, // Subject line
                text: "Your verification code is : ", // plain text body

            }, (error, dtat) => {
                if (error) {
                    console.log("Error");
                    res.status(500);
                    res.send("EmailNotSent!")
                } else {
                    console.log("Succes");
                    res.status(200);
                    res.send("EmailSent!")
                }
            });
        } else {
            res.status(500);
            res.send({ msg: "failed" })
        }
    } catch {
        res.status(501);
        res.send({ msg: "failed" })
    }


})

module.exports = customer;





/*
customer.patch('/addcard/:id', async (req, res) => {
    const userID=req.url.split('/')[2];
    console.log(userID);
    const { body } = req;
    let userEmail = "";
    try{
    jwt.verify(body.token, secretKey, function (err, decoded) {
        if (!err) {
            userEmail = decoded.username;
        } else {
            throw "access denied"
        }
    });

    let userData = await Customer.findOne({ email: userEmail });
    if (userData != null) {
        userData.cart.push({tripId:body.tripid,travelerNum:body.travelernum,coast:body.tripcost});
        console.log({tripId:body.tripid,travelerNum:body.travelernum,coast:body.tripcost},"cart");
        let userData = await Customer.findOneAndUpdate({ email: userEmail }, userData);
        if (userData != null) {
            res.status(200).json({ msg: "UpDate Done" });
        } else {
            res.status(400);
            res.send({ msg: "UpDate Not Done" })
        }
    } 
}catch(error){
    res.status(400);
    res.send({errormsg:error}) 
}
});
customer.patch('/deletcard', async (req, res) => {
    const { body } = req;
    let userEmail = "";
    jwt.verify(body.token, secretKey, function (err, decoded) {
        if (!err) {
            userEmail = decoded.username;
        } else {
            console.log(err)
            res.status(400);
            res.send({ msg: "No Access Alowed" })
        }
    });

    let userData = await Customer.findOne({ email: userEmail });
    if (userData != null) {
        for(let i=0;i<userData.cart.length;i++){
            console.log( userData.cart[i].tripId,"=", body.tripid )
            if(userData.cart[i].tripId===body.tripid){
                console.log(userData.cart[i],"deleted");
                userData.cart.remove(userData.cart[i]);
                break;
            }
            console.log(userData.cart[i]);
        }


        let data = await Customer.findOneAndUpdate({ email: userEmail }, userData);
        if (data != null) {
            res.status(200).json({ msg: "UpDate Done" });
        } else {
            res.status(400);
            res.send({ msg: "UpDate Not Done" })
        }
    } else {
        res.status(400);
        res.send({ msg: "Wrong Token" })
    }
})*/