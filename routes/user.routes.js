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
    res.render('user/create-user.ejs', {
        roles: allRoles,
        error: null
    })
})

router.post('/', isSignedIn, isAdmin, async (req, res) => {
    try {
        const allRoles = await Role.find()
        const { username, password, confirmPassword, role } = req.body

        const userInDatabase = await User.findOne({ username: username });
        if (userInDatabase) {
            return res.render('user/create-user.ejs', {
                roles: allRoles,
                error: "Username already taken."
            });
        }

        if (password !== confirmPassword) {
            return res.render('user/create-user.ejs', {
                roles: allRoles,
                error: "Password and Confirm Password must match"
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await User.create({
            username: username,
            password: hashedPassword,
            role: role
        });
        res.redirect("/user/");

    } catch (err) {
        const allRoles = await Role.find()
        if (err.name === "ValidationError") {
            return res.render('user/create-user.ejs', {
                roles: allRoles,
                error: err.message,
            });
        }
        if (err.code === 11000) {
            return res.render('user/create-user.ejs', {
                roles: allRoles,
                error: "Resource already exists with this name",
            });
        }
    }
})

//update
router.get('/:userId/update', isSignedIn, isAdmin, async (req, res) => {
    try {
        const allRoles = await Role.find()
        const foundUser = await User.findById(req.params.userId)
        res.render('user/update-user.ejs', {
            user: foundUser,
            roles: allRoles,
            error: null
        })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.put('/:userId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const { role } = req.body
        const user = await User.findByIdAndUpdate(req.params.userId, {
            role: role
        });
        res.redirect("/user/");
    } catch (err) {
        const allRoles = await Role.find()
        const foundUser = await User.findById(req.params.userId)
        if (err.name === "ValidationError") {
            return res.render('user/update-user.ejs', {
                user: foundUser,
                roles: allRoles,
                error: err.message,
            });
        }
        if (err.code === 11000) {
            return res.render('user/update-user.ejs', {
                user: foundUser,
                roles: allRoles,
                error: "Resource already exists with this name",
            });
        }
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
            res.render('user/change-password.ejs', { user: foundUser, error: null })
        } catch (err) {
            console.log('Error: ', err)
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
})

router.put('/:userId/change-password', isSignedIn, async (req, res) => {
    const foundUser = await User.findById(req.params.userId)
    try {
        const { password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            return res.render('user/change-password.ejs', { 
                user: foundUser,
                error:"Password and Confirm Password must match"});
        }
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await User.findByIdAndUpdate(req.params.userId, {
            password: hashedPassword
        });

        res.redirect("/user/" + user._id);
    } catch (err) {
        const foundUser = await User.findById(req.params.userId)
        if (err.name === "ValidationError") {
            return res.render('user/change-password.ejs', { 
                user: foundUser,
                error: err.message,
            });
        }
        if (err.code === 11000) {
            return res.render('user/change-password.ejs', { 
                user: foundUser,
                error: "Resource already exists with this name",
            });
        }
    }
})

//read one (view own account)
router.get('/:userId', isSignedIn, async (req, res) => {
    if (String(req.session.user._id) === req.params.userId) {
        try {
            const foundUser = await User.findById(req.params.userId).populate('role')
            res.render('user/user-details.ejs', { user: foundUser })
        } catch (err) {
            console.log('Error: ', err)
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }
})

module.exports = router