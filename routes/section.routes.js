//imports
const express = require("express");
const router = express.Router();

const isSignedIn = require('../middleware/is-signed-in')
const isAdmin = require("../middleware/is-admin");
const isStudent = require("../middleware/is-student");

const Section = require("../models/Section");
const Course = require('../models/Course');

//routes
//create
router.get('/new', isSignedIn, isAdmin, async (req, res)=>{

})

router.post('/new', isSignedIn, isAdmin, async (req, res)=>{

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