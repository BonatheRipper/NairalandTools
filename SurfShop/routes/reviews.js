const express = require('express');
const router = express.Router({mergeParams: true});
const {asyncErrorHandler}  = require("../middleware/index")
const {isReviewAuthor, canReview}  = require("../middleware/reviews")

const {
  createReviews,
  updateReviews,
  deleteReviews} =  require("../controllers/reviews")


/* Post reviews Create /post/:id/reviews*/
router.post('/', canReview,  asyncErrorHandler(createReviews));

/* GET reviews Update reviews/:reviews_id*/
router.put('/:reviews_id', asyncErrorHandler(canReview),  isReviewAuthor, asyncErrorHandler(updateReviews));

/* GET reviews Delete reviews/:reviews_id */
router.delete('/:reviews_id', asyncErrorHandler(canReview), isReviewAuthor,  asyncErrorHandler(deleteReviews));
module.exports = router;