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

//routes
//create
router.get('/new/:courseId', isSignedIn, isAdmin, async (req, res)=>{
    try{
        const foundCourse = await Course.findById(req.params.courseId)
        const toturs = await User.find({role: await Role.find({name: 'tutor'})})
        res.render('section/create-section.ejs', {course: foundCourse, tutors: toturs})
    }catch(err){
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.post('/new/:courseId', isSignedIn, isAdmin, async (req, res)=>{
    try{
        const{location, dayOfWeek,time,tutor} = req.body
        const createdSection = await Section.create({
            location: location,
            dayOfWeek: dayOfWeek,
            time: time,
            course: req.params.courseId,
            tutor: tutor
        })
        res.redirect('/courses/'+req.params.courseId)
    }catch(err){
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.post('/:sectionId/register', isSignedIn, isStudent, async (req, res)=>{

})

//update
router.get('/:sectionId/update', isSignedIn, isAdmin, async (req, res)=>{
    
})

router.put('/:sectionId', isSignedIn, isAdmin, async (req, res)=>{
    
})

//delete
router.delete('/:sectionId', isSignedIn, isAdmin, async (req, res)=>{
    
})



//export
module.exports = router