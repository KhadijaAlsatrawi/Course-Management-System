//import
const mongoose = require('mongoose')

//schema
const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowecase: true,
        minLength: 3,
        maxLength: 20
    },
    description:{
        type: String,
        required: true,
        trim: true,
        minLength: 3
    }
},{timestamps: true})


//model
const School = mongoose.model('School', schoolSchema)

//export
module.exports = School