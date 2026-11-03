//import
const mongoose = require('mongoose')

//schema
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
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
const Role = mongoose.model('Role', roleSchema)

//export
module.exports = Role