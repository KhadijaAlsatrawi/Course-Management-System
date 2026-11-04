const router = require("express").Router()

const Role = require("../models/Role")
const User = require('../models/User')


router.get('/',async (req,res)=>{
    const allUsers = await User.find()

    const adminRole = await Role.find({name: 'admin'})
    const admins = await User.find({role: adminRole})

    const tutorRole = await Role.find({name: 'tutor'})
    const tutors = await User.find({role: tutorRole})

    const studentRole = await Role.find({name: 'student'})
    const students = await User.find({role: studentRole})

    res.render('admin/admin-dashboard.ejs',{
        users: allUsers, 
        admins: admins, 
        tutors: tutors, 
        students: students})
})

module.exports = router;
