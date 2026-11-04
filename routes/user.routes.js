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
        const { username, password, confirmPassword, role } = req.body

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
    try {
        const allRoles = await Role.find()
        const foundUser = await User.findById(req.params.userId)
        res.render('user/update-user.ejs', { user: foundUser, roles: allRoles })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.put('/:userId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const {role} = req.body
        const user = await User.findByIdAndUpdate(req.params.userId,{
            role: role
        });
        res.redirect("/user/");
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//delete
router.delete('/:userId', isSignedIn, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.redirect("/user/");
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

//change password
router.get('/:userId/change-password', isSignedIn, async (req, res) => {
    if (String(req.session.user._id) === req.params.userId) {
        try {
            const foundUser = await User.findById(req.params.userId)
            res.render('user/change-password.ejs', { user: foundUser })
        } catch (err) {
            console.log('Error: ', err)
            res.redirect('/')
        }
    }else{
        res.redirect('/')
    }
})

router.put('/:userId/change-password', isSignedIn, isAdmin, async (req, res) => {
    try {
        const {password, confirmPassword} = req.body

        if (password !== confirmPassword) {
            return res.send("Password and Confirm Password must match");
        }
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await User.findByIdAndUpdate(req.params.userId,{
            username: username,
            password: hashedPassword,
        });

        res.redirect("/user/");
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

module.exports = router