const mongoose = require('mongoose');
const db = require('../config/dbconfig');


mongoose.Promise = global.Promise;
mongoose.connect(db.MONGODB_URI)
    .then(() => console.log('MongoDB Connected...')).catch((err) => console.log(err));

module.exports = {mongoose};