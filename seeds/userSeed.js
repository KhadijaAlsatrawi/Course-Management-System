const bcrypt = require("bcrypt");

const User = require('../models/User.js')
const Role = require('../models/Role.js')

async function userSeed() {

    await User.deleteMany({})

    const testUsers = await User.insertMany([
        {
            username: 'student',
            password: bcrypt.hashSync('s@test', 10),
            role: await Role.findOne({name: 'student'}),
            email: 'student@testUsers.com'
        },
        {
            username: 'tutor',
            password: bcrypt.hashSync('t@test', 10),
            role: await Role.findOne({name: 'tutor'}),
            email: 'tutor@testUsers.com'
        },
        {
            username: 'admin',
            password: bcrypt.hashSync('a@test', 10),
            role: await Role.findOne({name: 'admin'}),
            email: 'admin@testUsers.com'
        }
    ])
}

module.exports = userSeed