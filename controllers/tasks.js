const Calender = require('../models/calender')
const Task = require('../models/task')
const ExpressError = require('../utils/ExpressError')

module.exports.sendYearlyTasksOfCalender = async (req, res) => {
    //will send the yearly task. with this to current user calender
    const calender = await Calender.findById(req.params.id).populate('tasks');
    const tasks = calender.tasks.filter((task) => task.time.year == req.query.year);
    res.send(tasks);
}

module.exports.addNewTaskInCalender = async (req, res) => {
    //adding in new task in the calender of current user
    const task = new Task(req.body)
    const calender = await Calender.findById(req.params.id)
    calender.tasks.push(task);
    const taskSave = await task.save();
    await calender.save();
    console.log(taskSave);
    res.send(taskSave);
}

module.exports.changeStatusOfTask = async (req, res) => {
    //update the task of given id 
    if (typeof (req.body.status) === "boolean") {
        const task = await Task.findByIdAndUpdate(req.params.taskId, { status: req.body.status })
        res.send(task)
    }
    else {
        next(new ExpressError("invalid input for task Status", 400));
    }
}

module.exports.removeTaskFromCalender = async (req, res) => {
    //delete task of given id and also remove from calender
    const { id, taskId } = req.params;
    await Calender.findByIdAndUpdate(id, { $pull: { tasks: taskId } })
    let task = await Task.findByIdAndDelete(taskId)
    res.send(task)
}