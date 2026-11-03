//import
const mongoose = require('mongoose')

//schema
const sectionSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        trim: true
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    time: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        required: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required: true
    },
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    tutor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
}, { timestamps: true })

//model
const Section = mongoose.model('Section', sectionSchema)

//export
module.exports = Section