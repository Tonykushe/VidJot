const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const { ObjectID } = require('mongodb');
const app = express();
const port = 3000;


var {mongoose} = require('./db/mongoose');
var {Idea} = require('./models/Idea');



// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride("_method"));

// Express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Flash middleware
app.use(flash());

// Global Variables for Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});


// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome Tony'
    res.render('home', {
        title
    });

});

// About Route
app.get('/about', (req, res) => {
    res.render('about');

});

// Add idea
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');

});

// Edit Idea
app.get('/ideas/edit/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400).send();
    }
    Idea.findById(id).then(idea => {
        if (!idea) {
            return res.status(404).send();
        }

        res.render('ideas/edit', {idea});
    }).catch(e => res.status(400).send());

});


// Post Idea Form
app.post('/ideas', (req, res) => {
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
            details: req.body.details
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
app.get('/ideas', (req, res) => {
    Idea.find()
        .sort({date: 'desc'})
        .then((ideas) => {
        res.render('ideas/ideas', {ideas});

    }).catch(e => res.status(400).send());

});

// Update Idea
app.put('/ideas/:id', (req, res) => {
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
app.delete('/ideas/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
       return res.status(404).send();
    }

    Idea.findByIdAndRemove(id).then(() => {
        req.flash('success_msg', 'Video idea Removed');
        res.redirect('/ideas');
    }).catch((e) => res.status(400).send());

});






































app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});