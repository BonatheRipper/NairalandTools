const mongoose = require("mongoose")
const Schema = mongoose.Schema
const moment = require("moment")
const time = moment().format("h:mm:ss a")+""


const section = new Schema({
    activeFemales: Number,
    activeMales: Number,
    sectionTitle: String,
    totalGuest: Number,
    totalUsersInSection: Number,
    Time: {
		type: String,
		default: time,
	}
})
module.exports = mongoose.model("Section", section)