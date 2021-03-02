const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbUrl = 'mongodb://localhost:27017/calender';

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
    await Test.deleteMany({})
    for(let i = 0; i <  4; i ++) {
        const test = new Test({
            name:  `${i} faizan`
        })
        await test.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})