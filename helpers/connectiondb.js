const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://{user:pass}@mycluster.plu2i.mongodb.net/Tourst?retryWrites=true&w=majority', {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

