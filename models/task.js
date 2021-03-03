const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    time: {
        year: {
            type: String, 
            required: true
        },
        month: {
            type: String, 
            required: true
        },
        date: {
            type: String, 
            required: true
        },
        hour: {
            type: String, 
            required: true
        },
        minute: {
            type: String,
            required: true
        }
    },
    status: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Task', TaskSchema)