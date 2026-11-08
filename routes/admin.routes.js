const router = require("express").Router()

const User = require('../models/User')
const School = require('../models/School')


router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find().populate('role')
        res.render('admin/admin-dashboard.ejs', { users: allUsers })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

module.exports = router;
