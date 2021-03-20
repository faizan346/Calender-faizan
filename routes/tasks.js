const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLogin, isAuthor, validateTask } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const tasks = require('../controllers/tasks')

router.route('/')
    .get(isLogin, isAuthor, catchAsync(tasks.sendYearlyTasksOfCalender))
    .post(isLogin, isAuthor, validateTask, catchAsync(tasks.addNewTaskInCalender))

router.route('/:taskId')
    .put(isLogin, isAuthor, catchAsync(tasks.changeStatusOfTask))
    .delete(isLogin, isAuthor, catchAsync(tasks.removeTaskFromCalender))

module.exports = router;