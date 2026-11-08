const connectToDB = require('./db.js')
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")

const schoolSeed = require("./seeds/schoolSeed.js")
const roleSeed = require("./seeds/roleSeed.js")
const userSeed = require("./seeds/userSeed.js")
const courseSeed = require("./seeds/courseSeed.js")

async function runSeeds() {
    await connectToDB()

    await roleSeed()
    await userSeed()

    await schoolSeed()
    await courseSeed()

    await mongoose.disconnect()
}

runSeeds()
