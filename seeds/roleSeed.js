const Role = require('../models/Role.js')

async function roleSeed() {
    await Role.deleteMany({})

    const roleData = await Role.insertMany([
        {
            name: 'student',
            description: 'student'
        },
        {
            name: 'tutor',
            description: 'tutor'
        },
        {
            name: 'admin',
            description: 'admin'
        }
    ])
}

module.exports = roleSeed