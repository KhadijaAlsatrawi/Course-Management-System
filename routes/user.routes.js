const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const isSignedIn = require("../middleware/is-signed-in");
const isAdmin = require("../middleware/is-admin");

const User = require("../models/User");
const Role = require("../models/Role");


//read
router.get('/', isSignedIn, isAdmin, async (req, res) => {
    try {
        const allUsers = await User.find().populate('role')
        res.render('user/index.ejs', { users: allUsers })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//create
router.get('/new', isSignedIn, isAdmin, async (req, res) => {
    const allRoles = await Role.find()
    res.render('user/create-user.ejs', { roles: allRoles })
})

router.post('/', isSignedIn, isAdmin, async (req, res) => {
    try {
        const {username, password, confirmPassword, role} = req.body

        const userInDatabase = await User.findOne({ username: username });
        if (userInDatabase) {
            return res.send("Username already taken.");
        }

        if (password !== confirmPassword) {
            return res.send("Password and Confirm Password must match");
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await User.create({
            username: username,
            password: hashedPassword,
            role: role
        });
        res.redirect("/user/");

    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//update
router.get('/:userId/update', isSignedIn, isAdmin, async (req, res) => {

})

router.put('/:userId', isSignedIn, isAdmin, async (req, res) => {

})

//delete
router.delete('/:userId', isSignedIn, isAdmin, async (req, res) => {

})

module.exports = router