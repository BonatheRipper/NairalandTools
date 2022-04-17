const express = require('express');
const router = express.Router();
const passport = require("passport")
const multer = require("multer");
const {storage} = require("../cloudinary/index")
const upload = multer({storage})
const {
  asyncErrorHandler,
   isLoggedIn,
   isValidPassword,
   changePassword
   }  = require("../middleware/index")
const {
  postRegister,
  postLogin,
  getLogout, 
  landingPage,
  getProfile,
  updateProfile,
  putResetPw,
  getResetPw,
  putForgotPw,
  getForgotPw
  }  = require("../controllers/index")



/* GET home page/ Landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET Register Page. */
router.get('/register', (req, res, next)=> {
  res.render("register.ejs", {title: "Register " , username: "", email: ""})
});

/* Post Register Page. */
router.post('/register', upload.single("image"), asyncErrorHandler(postRegister));
/* GET Login Page. */

router.get('/login', (req, res, next)=> {
  if(req.isAuthenticated()){
    return res.redirect("/")
  }
    res.render("login.ejs", {title: "Login"})

});

/* Post Login Page. */
router.post('/login', asyncErrorHandler(postLogin));

/* Logout */
router.get('/logout', getLogout);


/* Get User profile Page. */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));


    /* Put Profile Page. */
router.put("/profile/",
isLoggedIn,
upload.single("image"),
asyncErrorHandler(isValidPassword),
asyncErrorHandler(changePassword),
asyncErrorHandler(updateProfile),
   );


    /* get forgot password Page. */
router.get('/forgot-password', getForgotPw);


 /* Put forgot password Page. */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

 /* get reset password Page :token.  */
router.get('/reset/:token', getResetPw);

 /* put reset password Page :token. */
router.put('/reset/:token', asyncErrorHandler(putResetPw));

module.exports = router;
