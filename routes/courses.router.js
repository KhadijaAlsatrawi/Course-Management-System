//imports
const express = require("express");
const router = express.Router();
const isSignedIn = require('../middleware/is-signed-in')

const Course = require('../models/Course')
const School = require('../models/School');
const Section = require("../models/Section");

//routes
//all courses
router.get('/', async (req, res) => {
    try {
        const allCourser = await Course.find().populate('school')
        res.render('course/index.ejs', { courses: allCourser })

    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//create
router.get('/new', async (req, res) => {
    try {
        const allSchools = await School.find()
        res.render('course/create-course.ejs', { schools: allSchools })

    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
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
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//read one
router.get('/:courseId', async (req,res)=>{
    try {
        const foundCourse = await Course.findById(req.params.courseId).populate('school')
        let sections
        try{
            sections = await Section.find({course: req.params.courseId})
        }catch(err){
            sections = null
        }
        //const role = req.session.user.role
        res.render('course/course-details.ejs', { course: foundCourse, sections: sections, role: 'admin' })

    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//update
router.get('/:courseId/update', async (req,res)=>{

})

router.put('/:courseId', async (req,res)=>{

})

//delete
router.delete('/:courseId', async (req,res)=>{

})

//export
module.exports = router