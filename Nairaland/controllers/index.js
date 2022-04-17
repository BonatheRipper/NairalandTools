const mongoose = require("mongoose")
const Section = require('../models/sections');


module.exports = {
    
    async landingPage(req, res, next){
        const section = await Section.find({})
        res.render("index", {section})
    }
}