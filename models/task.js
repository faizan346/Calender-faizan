const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    time: {
        year: {
            type: Number, 
            required: true
        },
        month: {
            type: Number, 
            required: true
        },
        date: {
            type: Number, 
            required: true
        },
        hour: {
            type: Number, 
            required: true
        },
        minute: {
            type: Number,
            required: true
        }
    },
    status: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Task', TaskSchema)