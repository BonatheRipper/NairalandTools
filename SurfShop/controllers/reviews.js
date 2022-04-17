const Post = require("../models/post");
const Reviews = require("../models/reviews");



module.exports = {
// CREATE NEW Reviews

async createReviews(req, res, next){
let post = await Post.findById(req.params.id).populate("reviews").exec();
let haveReviewed = post.reviews.filter(review =>{
  return review.author.equals(req.user._id)
}).length
if(haveReviewed){
   req.session.error = "You have already reviewed"
  return res.redirect("/post/"+req.params.id)
}
req.body.reviews.author = req.user
let review = await Reviews.create(req.body.reviews);
post.reviews.push(review);
post.save()
req.session.success = "Review Created Successfully"
res.redirect("/post/"+req.params.id);

},

//UPDATE Reviews
async updateReviews(req, res, next){
  let reviews = await Reviews.findByIdAndUpdate(req.params.reviews_id, req.body.reviews);
  res.redirect('/post/'+req.params.id)
},

//DELETE Reviews
async deleteReviews(req, res, next){
  let post =  await Post.findById(req.params.id);
  for (review of post.reviews){
    if(review._id == req.params.reviews_id){
      let index = post.reviews.indexOf(review);
      post.reviews.splice(index, 1)
    }
  }
  await Reviews.findByIdAndRemove(req.params.reviews_id)
  post.save();
  req.session.success = "Review Deleted Successfully"
  res.redirect("/post/"+post.id)
}
}

