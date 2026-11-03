//imports
const express = require("express");
const router = express.Router();
const isSignedIn = require('../middleware/is-signed-in')

const Course = require('../models/Course')
const School = require('../models/School')

//routes
//all courses
router.get('/', async (req, res) => {
    try {
        const allCourser = await Course.find().populate('school')
        res.render('course/index.ejs', { courses: allCourser })
        
    } catch (err) {
        alert('Failed to load')
        console.log('Error: ', err)
        redirect('/')
    }
})

//create
router.get('/new', async (req, res) => {
    try {
        const allSchools = await School.find()
        res.render('course/create-course.ejs', { schools: allSchools })

    } catch (err) {
        alert('Failed to load')
        console.log('Error: ', err)
        redirect('/')
    }
})

router.post('/', async (req, res) => {
    try {
        const { name, description, school } = req.body
        const createdCourse = await Course.create({
            name: name,
            description: description,
            school: school,
        })
        res.redirect('/courses/' + createdCourse._id)

    } catch (err) {
        alert('Creation failes')
        console.log('Error: ', err)
        redirect('/')
    }
})

//export
module.exports = router