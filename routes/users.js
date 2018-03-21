const express = require("express");
const router = express.Router();
const { ObjectID } = require("mongodb");

// Connect to Mongoose DB
var { mongoose } = require("../db/mongoose");


// User Login Form
router.get('/login', (req, res) => {
    res.render("users/login");

});

// User Signup Form
router.get('/signup', (req, res) => {
    res.render('users/signup');

});



module.exports = router;