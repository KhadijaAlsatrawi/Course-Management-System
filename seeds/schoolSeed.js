const School = require('../models/School.js')

async function schoolSeed() {

    await School.deleteMany({})

    const schoolData = await School.insertMany([
        {
            name: 'ICT',
            description: 'The School of Information and Communication Technology includes many courses that are inline with the continues growth of the tech world.'
        },
        {
            name: 'Engineering',
            description: 'The School of Engineering has several programs that combine theory and practical work.'
        },
        {
            name: 'Business',
            description: 'The School of Business develops practical skills in many fielda preparing the student for the industry.'
        }
    ])

}

module.exports = schoolSeed