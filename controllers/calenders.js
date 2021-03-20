
const Calender = require('../models/calender')

module.exports.redirectToCalender = async (req, res) => {
    //current session calender redirect;
    const calender = await Calender.findOne({ author: req.user._id })
    res.redirect(`/calender/${calender._id}`)
}

module.exports.show = (req, res) => {
    //get calender page for user 
    const { username } = req.user;
    res.render("calender/show", { username });
}