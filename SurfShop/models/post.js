const mongoose = require("mongoose")
const Review = require("./reviews")
const mongoosePaginate = require("mongoose-paginate");

const Schema = mongoose.Schema
const postSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
    images: [ { path: String, filename: String } ],
    
    geometry: {
        type: {
            type: String,
        enum: ["Point"],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
    },
    properties: {
        description: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews:[{
         type: Schema.Types.ObjectId,
        ref: "Reviews"
    }],
    averageRating: {
        type: Number, default: 0
    }
    
})

postSchema.pre("remove", async function(){
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    });
});
postSchema.methods.calculateAverageRating = function(){
    let ratingsTotal = 0;
    this.reviews.forEach(review =>{
        ratingsTotal += review.rating
    });
    this.averageRating = Math.round((ratingsTotal/this.reviews.length))*10/10 || 0;
    
    const floorRating = Math.floor(this.averageRating)
    this.save("This is: " + this.averageRating);
    return floorRating;
}
postSchema.plugin(mongoosePaginate);
postSchema.index({geometry: "2dsphere"})
module.exports = mongoose.model("Post", postSchema)

// https://www.udemy.com/course/create-a-twitter-clone-with-nodejs-socketio-and-mongodb/
// https://www.udemy.com/course/nodejs-express-project-cms-and-shopping-cart/