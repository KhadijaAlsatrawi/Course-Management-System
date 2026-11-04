const router = require("express").Router()

const User = require('../models/User')
const School = require('../models/School')


router.get('/', async (req, res) => {

    res.render('admin/admin-dashboard.ejs')
})

module.exports = router;
