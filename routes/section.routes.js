//imports
const express = require("express");
const router = express.Router();

const isSignedIn = require('../middleware/is-signed-in')
const isAdmin = require("../middleware/is-admin");
const isStudent = require("../middleware/is-student");

const Section = require("../models/Section");
const Course = require('../models/Course');
const User = require('../models/User');
const Role = require("../models/Role");

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

//routes
//create
router.get('/new/:courseId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const foundCourse = await Course.findById(req.params.courseId)
        const toturs = await User.find({ role: await Role.find({ name: 'tutor' }) })
        res.render('section/create-section.ejs', { course: foundCourse, tutors: toturs, days: days })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.post('/new/:courseId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const { location, dayOfWeek, time, tutor } = req.body
        //validation
        const validDay = days.find(oneDay => oneDay === dayOfWeek)
        const validTime = time.match(timeRegex)
        if (validDay && validTime) {
            const createdSection = await Section.create({
                location: location,
                dayOfWeek: dayOfWeek,
                time: time,
                course: req.params.courseId,
                tutor: tutor
            })
        }
        res.redirect('/courses/' + req.params.courseId)
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.post('/:sectionId/register', isSignedIn, isStudent, async (req, res) => {
    try {
        const foundSection = await Section.findById(req.params.sectionId)
        const registerd = foundSection.students.find(oneStudent => oneStudent.equals(req.session.user._id))
        if (registerd) {
            await Section.findByIdAndUpdate(req.params.sectionId,
                { $pull: { students: req.session.user._id } }
            )
        } else {
            await Section.findByIdAndUpdate(req.params.sectionId,
                { $push: { students: req.session.user._id } }
            )
        }
        res.redirect('/courses/' + foundSection.course)
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//update
router.get('/:sectionId/update', isSignedIn, isAdmin, async (req, res) => {
    try {
        const foundSection = await Section.findById(req.params.sectionId).populate('course')
        const toturs = await User.find({ role: await Role.find({ name: 'tutor' }) })
        console.log(foundSection)
        res.render('section/update-section.ejs', { section: foundSection, tutors: toturs, days: days })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.put('/:sectionId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const { location, dayOfWeek, time, tutor } = req.body
        //validation
        const validDay = days.find(oneDay => oneDay === dayOfWeek)
        const validTime = time.match(timeRegex)
        if (validDay && validTime) {
            const createdSection = await Section.findByIdAndUpdate(req.params.sectionId, {
                location: location,
                dayOfWeek: dayOfWeek,
                time: time,
                tutor: tutor
            })
            res.redirect('/courses/' + createdSection.course)
        }
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//delete
router.delete('/:sectionId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const foundSection = await Section.findById(req.params.sectionId)
        await Section.findByIdAndDelete(req.params.sectionId)
        res.redirect('/courses/' + foundSection.course)
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})



//export
module.exports = router