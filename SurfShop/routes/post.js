const express = require('express');
const router = express.Router();
const multer = require("multer");
// const upload = multer({"dest": "uploads/"})
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
const {
  asyncErrorHandler, 
  isLoggedIn,
   isAuthor, 
   searchAndFilterPosts
  }  = require("../middleware/index")
const {
  getPost, 
  newPost, 
  createPost,
  showPost,
  editPost,
  updatePost,
  deletePost} =  require("../controllers/post")

/* GET Post. */
router.get('/', asyncErrorHandler(searchAndFilterPosts), asyncErrorHandler(getPost));

/* GET Post New */
router.get('/new', isLoggedIn, newPost);
 
/* GET Post Create */
router.post('/', isLoggedIn, upload.array("images", 4), asyncErrorHandler(createPost));

/* GET Post Show */
router.get('/:id', asyncErrorHandler(showPost));

/* GET Post Edit */
router.get('/:id/edit', isLoggedIn,  asyncErrorHandler(isAuthor), asyncErrorHandler(editPost));

/* GET Post Update */
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload.array("images", 4), asyncErrorHandler(updatePost));

/* GET Post Delete */
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor),  asyncErrorHandler(deletePost));

module.exports = router;