require('./config/dbconfig');
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const path = require('path');
const app = express();
const port = process.env.PORT;



// Load Routes
const ideas = require('./routes/ideas');
const users = require("./routes/users");

// Passport Config
require('./config/passport')(passport);




// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Static Public Folder
app.use(express.static(path.join(__dirname, 'public')));

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

// Passport Session Middleware
app.use(passport.initialize());
app.use(passport.session());


// Flash middleware
app.use(flash());

// Global Variables for Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Use Routes
app.use('/ideas', ideas);
app.use("/users", users);



// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome To VidJot'
    res.render('home', {
        title
    });

});

// About Route
app.get('/about', (req, res) => {
    res.render('about');

});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});