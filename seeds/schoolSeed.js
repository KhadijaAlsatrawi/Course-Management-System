const School = require('../models/School.js')

async function schoolSeed() {

    await School.deleteMany({})

    const schoolData = await School.insertMany([
        {
            name: 'ICT',
            description: 'Information Communication Technology'
        },
        {
            name: 'Engineering',
            description: 'Engineering'
        },
        {
            name: 'Business',
            description: 'Business'
        }
    ])

}

module.exports = schoolSeed