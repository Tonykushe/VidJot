const express = require('express');
const router = express.Router();
const { ObjectID } = require("mongodb");
const {ensureAuthenticated} = require('../helpers/auth');

// Connect to Mongoose DB
var {mongoose} = require('../db/mongoose');

// Connect to Models
var {Idea} = require('../models/Idea');


// Add idea
router.get('/add',ensureAuthenticated, (req, res) => {
    res.render('ideas/add');

});

// Edit Idea
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }
    Idea.findById(id).then(idea => {
        if (!idea) {
            return res.status(404).send();
        }
        if (idea.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized')
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', { idea });

        }
    }).catch(e => res.status(400).send());

});


// Post Idea Form
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({text: 'Please enter a title'});
    }

    if (!req.body.details) {
        errors.push({text: 'Please add some details'});
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        var idea = new Idea({
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        });

        idea.save().then(doc => {
            req.flash("success_msg", "Video idea Added");
            res.redirect('/ideas');
        }, (err) => {
            res.status(400).send(err)

        });
    }

});

// Get Ideas
router.get('/', ensureAuthenticated,(req, res) => {
    Idea.find({user: req.user.id})
        .sort({date: 'desc'})
        .then((ideas) => {
        res.render('ideas/ideas', {ideas});

    }).catch(e => res.status(400).send());

});

// Update Idea
router.put('/:id', ensureAuthenticated,(req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Idea.findById(id).then(idea => {
        idea.title = req.body.title,
        idea.details = req.body.details

        idea.save().then(doc => {
            req.flash("success_msg", "Video idea Updated");
            res.redirect("/ideas");
          }, err => {
            res.status(400).send(err);
          });
    });
});



// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
       return res.status(404).send();
    }

    Idea.findByIdAndRemove(id).then(() => {
        req.flash('success_msg', 'Video idea Removed');
        res.redirect('/ideas');
    }).catch((e) => res.status(400).send());

});


module.exports = router;