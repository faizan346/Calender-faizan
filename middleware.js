const { taskSchema } = require("./schemas")
const Calender = require('./models/calender')
const { ExpressError } = require('./utils/ExpressError')

module.exports.isLogin = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be signed in first!');
    res.redirect("/login")
}
module.exports.isAuthor = async function (req, res, next) {
    let calender = await Calender.findById(req.params.id)
    if (calender) {
        if (calender.author.equals(req.user._id)) return next();
    }
    calender = await Calender.findOne({ author: req.user._id })
    req.flash('error', "you don't have permission to do that")
    res.redirect(`/calender/${calender._id}`)
}

module.exports.validateTask = function (req, res, next) {
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