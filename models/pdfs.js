const mongoose = require("mongoose");
const Schema =  mongoose.Schema

const pdfs = new Schema({
    title: String,
    pdfPath: {
        type: String
    },
    num: Number
})
module.exports = mongoose.model("Pdf", pdfs)