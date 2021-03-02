const express = require("express");
const path = require("path")
const ejsMate = require("ejs-mate")
const methodOverride = require("method-override")
const mongoose = require('mongoose');

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
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))


app.get("/calender", (req, res) => {
    console.log(path.join(__dirname, 'public'))
    res.render("calender/index");
})

const port = 3000;
app.listen(port, () => {
    console.log(`Serving on ${port}`)
})