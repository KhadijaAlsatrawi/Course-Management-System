const connectToDB = require('./db.js')
const dotenv = require("dotenv").config()
const mongoose = require("mongoose")

const schoolSeed = require("./seeds/schoolSeed.js")
const roleSeed = require("./seeds/roleSeed.js")
const userSeed = require("./seeds/userSeed.js")

async function runSeeds() {
    await connectToDB()

    await schoolSeed()
    await roleSeed()
    await userSeed()

    await mongoose.disconnect()
}

runSeeds()
