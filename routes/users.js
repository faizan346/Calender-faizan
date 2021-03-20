const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')
const passport = require('passport');
const users = require('../controllers/users')

router.get("/", users.renderHome)

router.route('/login')
    .get(users.renderLoginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.loginUser))

router.route('/register')
    .get(users.GetRegisterPage)
    .post(catchAsync(users.registerAndLoginTheUser))

router.get("/logout", users.logoutUser)


module.exports = router;