//import
const mongoose = require('mongoose')

//schema
const sectionSchema = new mongoose.Schema({
    location: {
        type: String,
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    time: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ 
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Course'
    },
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    tutor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}, { timestamps: true })

//model
const Section = mongoose.model('Section', sectionSchema)

//export
module.exports = Section