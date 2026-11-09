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
        const foundCourse = await Course.findById(req.params.courseId)
        const toturs = await User.find({ role: await Role.find({ name: 'tutor' }) })
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
            return res.render('section/create-section.ejs', {
            course: foundCourse,
            tutors: toturs,
            days: days,
            error: 'Time is should be in HH:MM format supporting 24 hours.',
            });
        }

        const msg = encodeURIComponent(`A new Section for "${foundCourse.name}" has been created.`)
        res.redirect(`/courses/${req.params.courseId}?message=${msg}&type=success`)

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
                error: "Resource already exists with this name.",
            });
        }
    }
})

router.post('/:sectionId/register', isSignedIn, isStudent, async (req, res) => {
    try {
        const foundSection = await Section.findById(req.params.sectionId)
        const courseSections = await Section.find({ course: foundSection.course })

        const foundCourse = await Course.findById(foundSection.course).populate('school')
        console.log(foundCourse)
        let sections
        try {
            sections = await Section.find({ course: req.params.courseId }).populate('tutor')
        } catch (err) {
            sections = null
        }

        for (let oneSection of courseSections) {
            if (oneSection.students.find(oneStudent => oneStudent.equals(req.session.user._id))) {
                
                const msg = encodeURIComponent('You are registered in this Course.')
                return res.redirect(`/courses/${foundSection.course}?message=${msg}&type=danger`)
            }
        }

        const registerd = foundSection.students.find(oneStudent => oneStudent.equals(req.session.user._id))
        if (!registerd) {
            await Section.findByIdAndUpdate(req.params.sectionId,
                { $push: { students: req.session.user._id } }
            )
        } else {
            const msg = encodeURIComponent('You are registed in this section.')
            return res.redirect(`/courses/${foundCourse._id}?message=${msg}&type=danger`)
        }

        const msg = encodeURIComponent('You are registed in this section.')
        res.redirect(`/courses/${foundCourse._id}?message=${msg}&type=success`)
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

            const msg = encodeURIComponent('You are not registed in this section.')
            return res.redirect(`/courses/${foundCourse._id}?message=${msg}&type=danger`)
        }

        const msg = encodeURIComponent('You are unregisted from this section.')
        res.redirect(`/courses/${foundSection.course}?message=${msg}&type=success`)
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
            const msg = encodeURIComponent(`The Section has been updates.`)
            res.redirect(`/courses/${createdSection.course}?message=${msg}&type=success`)
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

        const msg = encodeURIComponent(`Section has been deleted`)
        res.redirect(`/courses/${foundSection.course}?message=${msg}&type=success`)
    } catch (err) {
        console.log('Error: ', err)
        const msg = encodeURIComponent(`Something went wrong.`)
        res.redirect(`/courses?message=${msg}&type=danger`)
    }
})



//export
module.exports = router