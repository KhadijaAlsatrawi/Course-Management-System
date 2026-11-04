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
//read
router.get('/my-sections', isSignedIn, async (req, res) => {
    try {
        let foundSections
        if (req.session.user.role === 'tutor') {
            foundSections = await Section.find({ tutor: req.session.user._id }).populate('tutor').populate('course')
        } else if (req.session.user.role === 'student') {
            foundSections = await Section.find({ students: req.session.user._id }).populate('tutor').populate('course')
        } else {
            res.redirect('/')
        }
        res.render('section/index.ejs', { sections: foundSections })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//create
router.get('/new/:courseId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const foundCourse = await Course.findById(req.params.courseId)
        const toturs = await User.find({ role: await Role.find({ name: 'tutor' }) })
        res.render('section/create-section.ejs', {
            course: foundCourse,
            tutors: toturs,
            days: days,
            error: null
        })
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
        } else if (!validTime) {
            return res.render('section/update-section.ejs', {
                section: foundSection,
                tutors: toturs,
                days: days,
                error: 'Time is should be in HH:MM format supporting 24 hours',
            });
        }
        res.redirect('/courses/' + req.params.courseId)
    } catch (err) {
        const foundCourse = await Course.findById(req.params.courseId)
        const toturs = await User.find({ role: await Role.find({ name: 'tutor' }) })
        if (err.name === "ValidationError") {
            return res.render('section/create-section.ejs', {
                course: foundCourse,
                tutors: toturs,
                days: days,
                error: err.message,
            });
        }
        if (err.code === 11000) {
            return res.render('section/create-section.ejs', {
                course: foundCourse,
                tutors: toturs,
                days: days,
                error: "Resource already exists with this name",
            });
        }
    }
})

router.post('/:sectionId/register', isSignedIn, isStudent, async (req, res) => {
    try {
        const foundSection = await Section.findById(req.params.sectionId)
        const courseSections = await Section.find({ course: foundSection.course })

        const foundCourse = await Course.findById(req.params.courseId).populate('school')
        let sections
        try {
            sections = await Section.find({ course: req.params.courseId }).populate('tutor')
        } catch (err) {
            sections = null
        }

        for (let oneSection of courseSections) {
            if (oneSection.students.find(oneStudent => oneStudent.equals(req.session.user._id))) {
                return res.render('course/course-details.ejs', {
                    course: foundCourse,
                    sections: sections,
                    error: "you are registed in this course"
                })
            }
        }

        const registerd = foundSection.students.find(oneStudent => oneStudent.equals(req.session.user._id))
        if (!registerd) {
            await Section.findByIdAndUpdate(req.params.sectionId,
                { $push: { students: req.session.user._id } }
            )
        } else {
            return res.render('course/course-details.ejs', {
                course: foundCourse,
                sections: sections,
                error: "you are registed in this section"
            })
        }
        res.redirect('/courses/' + foundSection.course)
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.post('/:sectionId/unregister', isSignedIn, isStudent, async (req, res) => {
    try {
        const foundSection = await Section.findById(req.params.sectionId)

        const foundCourse = await Course.findById(req.params.courseId).populate('school')
        let sections
        try {
            sections = await Section.find({ course: req.params.courseId }).populate('tutor')
        } catch (err) {
            sections = null
        }

        const registerd = foundSection.students.find(oneStudent => oneStudent.equals(req.session.user._id))
        if (registerd) {
            await Section.findByIdAndUpdate(req.params.sectionId,
                { $pull: { students: req.session.user._id } }
            )
        } else {
            return res.render('course/course-details.ejs', {
                course: foundCourse,
                sections: sections,
                error: "you are not registed in this section"
            })
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
        res.render('section/update-section.ejs', {
            section: foundSection,
            tutors: toturs,
            days: days,
            error: null
        })
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
        else if (!validTime) {
            return res.render('section/update-section.ejs', {
                section: foundSection,
                tutors: toturs,
                days: days,
                error: 'Time is should be in HH:MM format supporting 24 hours',
            });
        }
    } catch (err) {
        const foundSection = await Section.findById(req.params.sectionId).populate('course')
        const toturs = await User.find({ role: await Role.find({ name: 'tutor' }) })
        if (err.name === "ValidationError") {
            return res.render('section/update-section.ejs', {
                section: foundSection,
                tutors: toturs,
                days: days,
                error: err.message,
            });
        }
        if (err.code === 11000) {
            return res.render('section/update-section.ejs', {
                section: foundSection,
                tutors: toturs,
                days: days,
                error: "Resource already exists with this name",
            });
        }
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