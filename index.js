const express = require('express');
const morgan = require('morgan');
const UsersRouter=require('./routers/users');
const customer = require('./routers/customer');
const GuideME=require('./routers/comment');
const specialOffer=require('./routers/specialOffer')
require('./helpers/connectiondb');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded());
const Offers=require('./routers/offers');

app.use('/api/offers',Offers);
app.use('/api/specialoffer',specialOffer);
app.use('/api/posts',GuideME);
app.use('/api/user',customer);
app.use('/api/company',UsersRouter);

// app.get('/*',(req,res)=>{
//   res.status(404).send('<h1> 404 Not Found</h1>')
// })

const port=process.env || 3000

app.listen(port, () => {
  console.log(`server listen in port ${port}`);
});
