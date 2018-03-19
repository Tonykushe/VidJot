 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 var IdeaSchema = new Schema({
     title: {
         type: String,
         required: true
     },
     details: {
         type: String,
         required: true
     },
     date: {
         type: Date,
         default: Date.now
     }
 });

 var Idea = mongoose.model('Ideas', IdeaSchema);

 module.exports = {Idea}