const Course = require('../models/Course.js')
const School = require('../models/School.js')

async function courseSeed() {
    const ictSchool = await School.findOne({name: 'ICT'})
    const engSchool = await School.findOne({name: 'Engineering'})
    const busSchool = await School.findOne({name: 'Business'})

    await Course.deleteMany({})

    const courseData = await Course.insertMany([
        {
            name: 'JavaScript',
            description: 'Learn the basics of JavaScript',
            school: ictSchool._id
        },
        {
            name: 'Web Development',
            description: 'Learn the basics of web development',
            school: ictSchool._id
        },
        {
            name: 'Electrical',
            description: 'Learn the basics of electrical engineering',
            school: engSchool._id
        },
        {
            name: 'Chemical',
            description: 'Learn the basics of chemical engineering ',
            school: engSchool._id
        },
        {
            name: 'Finance',
            description: 'Learn the basics of finance',
            school: busSchool._id
        },
        {
            name: 'Marketing',
            description: 'Learn the basics of marketing',
            school: busSchool._id
        }
    ])

}

module.exports = courseSeed