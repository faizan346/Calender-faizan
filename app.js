if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require("path")
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const Calender = require('./models/calender')
const mongoSanitize = require('express-mongo-sanitize');
const Task = require('./models/task')
const User = require('./models/user');
const MongoDBStore = require("connect-mongo").default;
const ExpressError = require("./utils/ExpressError")
const catchAsync = require("./utils/catchAsync")
const { taskSchema } = require("./schemas")
const dbUrl = 'mongodb://localhost:27017/calender';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log("Database Connected"))
    .catch((e) => console.log(e));

const secret = "ILoveAnimeAndManga";

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function isLogin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be signed in first!');
    res.redirect("/login")
}
async function isAuthor(req, res, next) {
    let calender = await Calender.findById(req.params.id)
    if (calender) {
        if (calender.author.equals(req.user._id)) return next();
    }
    calender = await Calender.findOne({ author: req.user._id })
    req.flash('error', "you don't have permission to do that")
    res.redirect(`/calender/${calender._id}`)
}

function validateTask(req, res, next) {
    const { error } = taskSchema.validate(req.body);
    console.log(req.body);
    console.log(error)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get("/", (req, res) => {
    const Authenticated = req.isAuthenticated();
    res.render("home", { Authenticated });
})

app.get("/login", (req, res) => {
    res.render("user/login")
})
app.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {
    //save user in session using passport and redirect to respective calender
    console.log(req.session);
    const calender = await Calender.findOne({ author: req.user._id })
    req.flash('success', 'welcome back!');
    res.redirect(`/calender/${calender._id}`)
}))

app.get("/logout", (req, res) => {
    req.logOut();
    req.flash('success', 'you are successfully logged out')
    res.redirect("/");
})

app.get("/register", (req, res) => {
    res.render("user/register")
})
app.post("/register", catchAsync(async (req, res, next) => {
    //create calender and user and redirect to calender
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        const calender = new Calender({ author: registerUser._id });
        await calender.save()
        console.log(calender)
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to calender!');
            console.log(calender._id, `/calender/${calender._id}`)
            res.redirect(`/calender/${calender._id}`);
        })
    } catch(e) {
        if(e.message.indexOf('E11000') != -1){
            req.flash('error', "Email is already registered")
        }
        else {
            req.flash('error', "username is already taken");
        }
        res.redirect('/register')
        console.log(e);
    }
}))

app.get("/calender", isLogin, catchAsync(async (req, res) => {
    //current session calender redirect;
    const calender = await Calender.findOne({ author: req.user._id })
    res.redirect(`/calender/${calender._id}`)
}))
app.get("/calender/:id", isLogin, isAuthor, (req, res) => {
    //get calender page for user 
    const { username } = req.user;
    res.render("calender/show", { username });
})

app.get('/calender/:id/task', isLogin, isAuthor, catchAsync(async (req, res) => {
    //will send the yearly task. with this to current user calender
    const calender = await Calender.findById(req.params.id).populate('tasks');
    const tasks = calender.tasks.filter((task) => task.time.year == req.query.year);
    res.send(tasks);
}))
app.post('/calender/:id/task', isLogin, isAuthor, validateTask, catchAsync(async (req, res) => {
    //adding in new task in the calender of current use
    const task = new Task(req.body)
    const calender = await Calender.findById(req.params.id)
    calender.tasks.push(task);
    const taskSave = await task.save();
    await calender.save();
    console.log(taskSave);
    res.send(taskSave);
}))
app.put('/calender/:id/task/:taskId', isLogin, isAuthor, catchAsync(async (req, res) => {
    //update the task of given id 
    if(typeof(req.body.status) === "boolean") {
        const task = await Task.findByIdAndUpdate(req.params.taskId, { status: req.body.status })
        res.send(task)
    }
    else {
        next(new ExpressError("invalid input for task Status", 400));
    }
}))
app.delete('/calender/:id/task/:taskId', isLogin, isAuthor, catchAsync(async (req, res) => {
    //delete task of given id and also remove from calender
    const { id, taskId } = req.params;
    await Calender.findByIdAndUpdate(id, { $pull: { tasks: taskId } })
    let task = await Task.findByIdAndDelete(taskId)
    res.send(task)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = 3000;
app.listen(port, () => {
    console.log(`Serving on ${port}`)
})