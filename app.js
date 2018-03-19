const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000;


var {mongoose} = require('./db/mongoose');
var {Idea} = require('./models/Idea');



// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


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






































app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});