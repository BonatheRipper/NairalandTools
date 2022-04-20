const mongoose = require("mongoose")
const Schema = mongoose.Schema
const users = new Schema({
    email: String
})
module.exports = mongoose.model("User", users)