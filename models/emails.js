const mongoose = require("mongoose")
const Schema = new mongoose.Schema;

const emails = Schema({
    title: String,
    emails: [String]
})

module.exports = mongoose.model("Emails", emails)