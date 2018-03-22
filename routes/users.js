const express = require("express");
const router = express.Router();
const bycrypt = require('bcryptjs');
const passport = require('passport');
const {ObjectID} = require("mongodb");

// Connect to Mongoose DB
var {mongoose} = require("../db/mongoose");

// Connect to Models
var {User} = require('../models/User');


// User Login Form
router.get('/login', (req, res) => {
    res.render("users/login");

});

// User login POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// User Signup POST
router.post('/signup', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({
            text: 'Passwords do not match'
        });
    }

    if (req.body.password < 6) {
        errors.push({
            text: 'Password must be at least 6 characters'
        });
    }
    if (errors.length > 0) {
        res.render('users/signup', {
            errors,
            name: req.body.name,
            email: req.body.email
        })
    } else {
        User.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                req.flash('error_msg', 'Email already registered');
                res.redirect('/users/signup');

            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bycrypt.genSalt(10, (err, salt) => {
                    bycrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;

                        newUser.save().then((doc) => {
                            req.flash("success_msg", "Account created successfully, you can now login");
                            res.redirect('/users/login');
                        }).catch(e => res.status(400).send());;
                    });
                });
            }
        });
    }
});

// User Signup GET FORM
router.get('/signup', (req, res) => {
    res.render('users/signup');

})

// User logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');

})




module.exports = router;