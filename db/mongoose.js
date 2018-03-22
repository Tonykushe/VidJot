const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected...')).catch((err) => console.log(err));

module.exports = {mongoose};