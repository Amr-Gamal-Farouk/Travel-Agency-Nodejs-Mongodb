const { Router } = require('express');
// const { ObjectId } = require('mongodb');
const Offer = require('../models/offer');
const Customer = require('../models/Customer');
const Offers = Router();


Offers.get('/', (req, res, next) => {

  Offer.find({})
    .then((data) => {
      res.status(200).json(data)

    })
    .catch((err) => {
      res.status(500).json(err)
    })
})

//Get Offers By City
Offers.get('/:city', (req, res, next) => {
  Offer.find({ "offer_city": req.url.split('/')[2] }).sort({ offer_cost: -1 })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json(err)
    })
})

Offers.get('/:companyid', (req, res, next) => {
  Offer.find({ "company_ID": req.url.split('/')[2] }).sort({ offer_cost: -1 })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json(err)
    })
})


//Add Offer
Offers.post('/', (req, res, next) => {
  const { body } = req;
  const newOffer = new Offer(body)
  let data = newOffer.save()
  data.then((newOffer) => {
    res.status(200).send(newOffer)
  })
  data.catch((err) => {
    res.status(400).json(err.message)
  })

})

// add to Cart
Offers.post('/addcart/:id', async (req, res) => {
  const userid = req.url.split('/')[2];
  const { body } = req;
  try {
    const { offerId, travelerNum, coast } = body;
    let data = await Customer.findOne({ _id:userid });
    if (data != null) {
      data.cart.push({ offerId, travelerNum, coast });
      let userData = await Customer.findOneAndUpdate({ _id:userid }, data);
      if (userData != null) {
        let trip = await Offer.findOne({ _id: offerId })
        if (trip != null) {
          trip.user_ID.push({ userid, customername: data.firstName + data.LastName, travelerNum });
          trip.offer_guestCurrentNo+=travelerNum;
          let tripupdate = await Offer.findOneAndUpdate({ _id:offerId }, trip);
          if (tripupdate != null) {
            res.status(200).send({ msg: "Added to user and trip " })
          } else {
            throw "offer failed to update"
          }
        }
      } else {
        throw "UpDate Not Done"
      }
    }
    else {
      throw "user  failed to update"
    }
  } catch (error) {
    res.status(400);
    res.send({ msg: error })
  }
})


// delet from cart
Offers.delete('/deletecart/:id', async (req, res) => {
  const userid = req.url.split('/')[2];
  const { body } = req;
  try {
    const { offerId, travelerNum, coast } = body;
    let data = await Customer.findOne({ _id:userid });
    if (data != null) {
      for(let i=0;i<data.cart.length;i++){
        if(data.cart[i].offerId==offerId){
          data.cart.splice(i,1);
        }
      }
      let userData = await Customer.findOneAndUpdate({ _id:userid }, data);
      if (userData != null) {
        let trip = await Offer.findOne({ _id: offerId })
        if (trip != null) {
          for(let y=0;y<trip.user_ID.length;y++){
            if(trip.user_ID[y].userid==userid){
              trip.user_ID.splice(y,1);
            }
          }
          trip.offer_guestCurrentNo-=travelerNum;
          let tripupdate = await Offer.findOneAndUpdate({ _id:offerId }, trip);
          if (tripupdate != null) {
            res.status(200).send({ msg: "Added to user and trip " })
          } else {
            throw "offer failed to update"
          }
        }
      } else {
        throw "UpDate Not Done"
      }
    }
    else {
      throw "user  failed to update"
    }
  } catch (error) {
    res.status(400);
    res.send({ msg: error })
  }
})

// to get all users that conferm trip
Offers.get('/users', async (req, res) => {
  try {
    const { travellerId } = req.body;
    let users = await Customer.find({ _id: { $in: [...travellerId] } });
    if (users != null) {
      res.status(200).json(users);
    } else {
      res.status(400);
      res.send({ msg: "failed to get users" })
    }
  } catch {
    res.status(404);
    res.send({ msg: "error" })
  }
})
module.exports = Offers;
