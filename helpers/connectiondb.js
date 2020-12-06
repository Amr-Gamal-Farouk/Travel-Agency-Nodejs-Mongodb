const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://abdallahSaber:01066773356@cluster0.fzcm3.mongodb.net/Company?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect('mongodb+srv://{user:password}@mycluster.plu2i.mongodb.net/Tourst?retryWrites=true&w=majority', {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
