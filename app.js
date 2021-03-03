const express = require("express");
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const Calender = require('./models/calender')
const Task = require('./models/task')
const User = require('./models/user')
const dbUrl = 'mongodb://localhost:27017/calender';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("Database Connected"))
.catch((e) => console.log(e));

const app = express();

// app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.get("/login", (req,res) => {
    
})
app.post("/login", (req,res) => {
    res.redirect("/calender")
})

app.get("/register", (req,res) => {
    
})
app.post("/register", (req,res) => {
    res.redirect("/calender")
})

app.get("/calender", (req, res) => {
    res.redirect(`/calender/53532`)
})
app.get("/calender/:id", (req, res) => {
    const path = `/calender/${req.params.id}`;
    res.render("calender/show", {path});
})

app.get('/calender/:id/task', (req,res) => {
    //will send the yearly task.
})
app.post('/calender/:id/task', (req,res) => {
    console.log(req.body)
    console.log()
})
app.delete('/calender/:id/task/:taskId', (req,res) => {
    
})

const port = 3000;
app.listen(port, () => {
    console.log(`Serving on ${port}`)
})