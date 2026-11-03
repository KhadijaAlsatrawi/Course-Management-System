//import
const mongoose = require('mongoose')

//schema
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minLength: 3,
        maxLength: 20,
        toLowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 3
    },
    school:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    }
}, { timestamps: true })

//model
const Course = mongoose.model('Course', courseSchema)

//export
module.exports = Course