const mongoose = require("mongoose");
const Schema =  mongoose.Schema

const numbers = new Schema({
    title: String,
    phones: {
        Type: String
    }
})

module.exports = mongoose.model("Numbers", numbers)