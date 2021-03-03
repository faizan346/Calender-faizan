const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbUrl = 'mongodb://localhost:27017/calender';
const Calender = require('../models/calender')
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(() => console.log("Database Connected"))
.catch((e) => console.log(e));

const testSchema = new Schema({
    name: String,
    age: Number
})

const Test = mongoose.model('Test', testSchema)

const seedDB = async () => {
    await Calender.deleteMany({})
    for(let i = 0; i <  4; i ++) {
        const test = new Calender({
            name:  `${i} faizan`
        })
        await test.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})