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
    //if logged in logged out
})
app.post("/login", (req,res) => {
    //ceate session using passport and redirect to respective calender
    res.redirect("/calender")
})

app.get("/register", (req,res) => {
    //ask for register pager if logged in loggout
})
app.post("/register", (req,res) => {
    //create calender and user and redirect to calender
    res.redirect("/calender")
})

app.get("/calender", (req, res) => {
    //if nothing match send to current session calender
    res.redirect(`/calender/603fc51d0105828e5bd27650`)
})
app.get("/calender/:id", (req, res) => {
    //get calender page for user 
    const path = `/calender/${req.params.id}`;
    res.render("calender/show", {path});
})

app.get('/calender/:id/task', (req,res) => {
    //will send the yearly task. with this to current user calender
})
app.post('/calender/:id/task', async(req,res) => {
    //adding in new task in the calender of current use
    const task = new Task(req.body)
    const calender = await Calender.findById(req.params.id)
    calender.tasks.push(task);
    const taskSave = await task.save();
    await calender.save();
    console.log(taskSave);
    res.send(taskSave);
})
app.delete('/calender/:id/task/:taskId', (req,res) => {
    //delete task of given id and also remove from calender
})

const port = 3000;
app.listen(port, () => {
    console.log(`Serving on ${port}`)
})