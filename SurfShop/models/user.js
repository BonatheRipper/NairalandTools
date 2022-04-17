const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const Schema =mongoose.Schema
const UserSchema = new Schema({
    username: String,
    resetPwToken: String,
    resetPwExpires: Date,
    email: {type: String, unique: true, required: true },
    image: {
        path:{ type: String, default: "/images/default-profile.jpg"},
        filename: String
    },
    post: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
})
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User", UserSchema)