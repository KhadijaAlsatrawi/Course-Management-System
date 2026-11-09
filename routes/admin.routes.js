const router = require("express").Router()

const User = require('../models/User')

const { jsPDF } = require('jspdf')
const { autoTable } = require('jspdf-autotable')
const Role = require("../models/Role")
const isSignedIn = require("../middleware/is-signed-in")
const isAdmin = require("../middleware/is-admin")

router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find().populate('role')
        res.render('admin/admin-dashboard.ejs', { users: allUsers })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.get('/export-to-pdf', async (req, res) => {
    try {
        const rows = await User.find().populate('role')

        const doc = new jsPDF()

        autoTable(doc, {
            head: [['Name', 'Email', 'Role']],
            body: rows.map(r => [r.username, r.email, r.role.name])
        })

        const pdf = Buffer.from(doc.output('arraybuffer'))

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="table.pdf"',
            'Content-Length': pdf.length
        })
        res.send(pdf)
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.get('/roles', async (req, res) => {
    try {
        const allRoles = await Role.find()

        res.render('admin/role-index.ejs', { roles: allRoles })
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.get('/roles/new', isSignedIn, isAdmin, (req, res) => {
    res.render('admin/create-role.ejs', { error: null })
})

router.post('/roles', isSignedIn, isAdmin, async (req, res) => {
    try {
        const { name, description } = req.body
        const createdRole = await Role.create({
            name: name,
            description: description
        })
        res.redirect('/admin/roles')
    } catch (err) {
        const allSchools = await School.find()
        if (err.name === "ValidationError") {
            return res.render('admin/create-role.ejs', {
                error: err.message,
            });
        }
        if (err.code === 11000) {
            return res.render('admin/create-role.ejs', {
                error: "Resource already exists with this name",
            });
        }
    }
})

router.get('/roles/:roleId/update', isSignedIn, isAdmin, async (req, res) => {
    try {
        const foundRole = await Role.findById(req.params.roleId)
        res.render('admin/update-role.ejs', {role: foundRole, error: null})
    } catch (err) {
        console.log('Error: ', err)
        res.redirect('/')
    }
})

router.put('/roles/:roleId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const { name, description} = req.body
        const updatedRole = await Role.findByIdAndUpdate(req.params.roleId, {
            name: name,
            description: description
        })

        const msg = encodeURIComponent(`Role "${updatedRole.name}" has been updated.`)
        res.redirect(`/admin/roles?message=${msg}&type=success`)

    } catch (err) {
        const foundRole = await Role.findById(req.params.roleId)
        if (err.name === "ValidationError") {
            return res.render('admin/update-role.ejs', {
                role: foundRole,
                error: err.message,
            });
        }
        if (err.code === 11000) {
            return res.render('admin/update-role.ejs', {
                role: foundRole,
                error: "Resource already exists with this name",
            });
        }
    }
})

router.delete('/roles/:roleId', isSignedIn, isAdmin, async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(req.params.roleId)

        const msg = encodeURIComponent(`Role "${deletedRole.name}" has been deleted.`)
        res.redirect(`/admin/roles?message=${msg}&type=success`)
    } catch (err) {
        console.log('Error: ', err)
        const msg = encodeURIComponent(`Something went wrong.`)
        res.redirect(`/admin/roles?message=${msg}&type=danger`)
    }
})


module.exports = router;
