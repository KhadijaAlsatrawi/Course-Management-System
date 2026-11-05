//imports
const express = require("express");
const router = express.Router();

const isSignedIn = require('../middleware/is-signed-in')
const isAdmin = require("../middleware/is-admin");

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
router.get('/new', isSignedIn, isAdmin, async (req, res) => {
    try {
        const allSchools = await School.find()
        res.render('course/create-course.ejs', { schools: allSchools, error: null })

    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.post('/', isSignedIn, isAdmin, async (req, res) => {
    try {
        const { name, description, school } = req.body
        const createdCourse = await Course.create({
            name: name,
            description: description,
            school: school,
        })
        res.redirect('/courses')

    } catch (err) {
        const allSchools = await School.find()
        if (err.name === "ValidationError") {
            return res.render('course/create-course.ejs', {
                schools: allSchools,
                error: err.message,
            });
        }
        if (err.code === 11000) {
            return res.render('course/create-course.ejs', {
                schools: allSchools,
                error: "Resource already exists with this name",
            });
        }
    }
})

router.get('/school/:scoolId', async (req, res)=>{
    try {
        const foundSchool = await School.findById(req.params.scoolId)
        const schoolCourses = await Course.find({school: foundSchool._id}).populate('school')
        res.render('course/school-courses.ejs', {school: foundSchool, courses: schoolCourses})
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//read one
router.get('/:courseId', async (req, res) => {
    try {
        const foundCourse = await Course.findById(req.params.courseId).populate('school')
        let sections
        try {
            sections = await Section.find({ course: req.params.courseId }).populate('tutor')
        } catch (err) {
            sections = null
        }
        res.render('course/course-details.ejs', { course: foundCourse, sections: sections, error: null })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//update
router.get('/:courseId/update', isSignedIn, isAdmin, async (req, res) => {
    try {
        const foundCourse = await Course.findById(req.params.courseId)
        const allSchools = await School.find()
        res.render('course/update-course.ejs', { course: foundCourse, schools: allSchools,  error: null})
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.put('/:courseId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const { name, description, school } = req.body
        const updatedCourse = await Course.findByIdAndUpdate(req.params.courseId, {
            name: name,
            description: description,
            school: school,
        })

        res.redirect('/courses/' + updatedCourse._id)
    } catch (err) {
        const foundCourse = await Course.findById(req.params.courseId)
        const allSchools = await School.find()
        if (err.name === "ValidationError") {
            return res.render('course/update-course.ejs', { 
                course: foundCourse, 
                schools: allSchools,
                error: err.message,
            });
        }
        if (err.code === 11000) {
            return res.render('course/update-course.ejs', { 
                course: foundCourse, 
                schools: allSchools,
                error: "Resource already exists with this name",
            });
        }
    }
})

//delete
router.delete('/:courseId', isSignedIn, isAdmin, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.courseId)
        await Section.deleteMany({ course: req.params.courseId })
        res.redirect('/courses')
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})


//export
module.exports = router