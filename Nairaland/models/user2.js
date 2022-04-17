const mongoose = require("mongoose")
const Schema = mongoose.Schema
const numVal = new Schema({
    num: Number
})
module.exports = mongoose.model("Num", numVal)