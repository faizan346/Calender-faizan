const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalenderSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    ]
})

module.exports = mongoose.model('Calender', CalenderSchema);