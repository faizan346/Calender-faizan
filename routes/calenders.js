const express = require('express');
const router = express.Router();
const { isLogin, isAuthor } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const calenders = require('../controllers/calenders')

router.get("/", isLogin, catchAsync(calenders.redirectToCalender))

router.get("/:id", isLogin, isAuthor, calenders.show)

module.exports = router;