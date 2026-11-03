//imports
const express = require("express");
const router = express.Router();
const isSignedIn = require('../middleware/is-signed-in')

const Course = require('../models/Course')
const School = require('../models/School')

//routes
//all courses
router.get('/', async (req, res)=>{
    const allCourser = await Course.find().populate('school')
    res.render('course/index.ejs', {courses: allCourser})
})

//create
router.get('/new', async (req, res)=>{
    const allSchools = await School.find()
    res.render('course/create-course.ejs', {schools: allSchools})
})

router.post('/', async (req, res)=>{
    const {name, description, school} = req.body

    const createdCourse = await Course.create({
        name: name,
        description: description,
        school: school,
    })

    res.redirect('/courses/'+createdCourse._id)
})

//export
module.exports = router