const Calender = require('../models/calender')
const User = require('../models/user')

module.exports.renderHome = (req, res) => {
    const Authenticated = req.isAuthenticated();
    res.render("home", { Authenticated });
}

module.exports.renderLoginPage = (req, res) => {
    res.render("user/login")
}

module.exports.loginUser = async (req, res) => {
    //save user in session using passport and redirect to respective calender
    console.log(req.session);
    const calender = await Calender.findOne({ author: req.user._id })
    req.flash('success', 'welcome back!');
    res.redirect(`/calender/${calender._id}`)
}

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'you are successfully logged out')
    res.redirect("/");
}

module.exports.GetRegisterPage = (req, res) => {
    res.render("user/register")
}

module.exports.registerAndLoginTheUser = async (req, res, next) => {
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
    } catch (e) {
        if (e.message.indexOf('E11000') != -1) {
            req.flash('error', "Email is already registered")
        }
        else {
            req.flash('error', "username is already taken");
        }
        res.redirect('/register')
        console.log(e);
    }
}