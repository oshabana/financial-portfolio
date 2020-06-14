const mongoose = require('mongoose');
const validator = require('validator');
mongoose.connect('mongodb://127.0.0.1:27017/asset-portfolio', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});