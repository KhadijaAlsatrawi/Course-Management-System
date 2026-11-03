//import
const mongoose = require('mongoose')

//schema
const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    description: {
        type: String,
        required: true,
        minLength: 3
    },
    school:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    }
}, { timestamps: true })

//model
const Course = mongoose.model('Course', courseSchema)

//export
module.exports = Course