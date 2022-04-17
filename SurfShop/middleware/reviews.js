const Reviews = require("../models/reviews");
module.exports = {
    async isReviewAuthor(req, res, next){
        let review =  await Reviews.findById(req.params.reviews_id)
        if(review.author.equals(req.user._id)){
            return next()
        }
        else{
            req.session.error = "You cant perfom this action"
            res.redirect("back")
        }  
    },
    async canReview(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        req.session.error = "You must be logged in to make a review"
        return res.redirect("back")
    }
}