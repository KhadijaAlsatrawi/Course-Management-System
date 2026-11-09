const router = require("express").Router()

const School = require("../models/School")

router.get('/', async (req,res)=>{
    const allSchools = await School.find()
    res.render('homepage.ejs', {schools: allSchools})
})

module.exports = router;
