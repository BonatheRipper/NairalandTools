const User = require("../models/user");
const Post = require("../models/post");
const mapBoxToken = "pk.eyJ1IjoiYm9uYTlqYSIsImEiOiJja3o0bGc0NzYwZmRyMnZtZXo3ajZienBuIn0._gyNE8Ji8lR1-BlKawySvw"
const util = require('util');
const passport = require("passport");
const {cloudinary} = require("../cloudinary/index");
const {deleteProfileImage} = require("../middleware/index");
const crypto = require("crypto");



module.exports = { 
  
  async landingPage(req, res, next){
  let post = await Post.find({}).sort("-_id").exec();
  const recentPosts = post.slice(0,10)
  res.render("index", {post, recentPosts, mapBoxToken, title: 'Surf Shop Home' })
  },

    /* POST REGISTER ROUTE */
    async postRegister(req, res, next){
      try{
        // await User.remove({});
       
        if(req.file){
          const {path, filename} = req.file
          req.body.image = {path, filename}

        }
         let user = await  User.register(new User(req.body), req.body.password);
         req.login(user, function(err){
          if(err) return next(err)
          req.session.success = "Welcome to SurfShop " + user.username + " !"
          return res.redirect('/');
        })   
      }catch(e){
        deleteProfileImage(req)
        const {username, email } = req.body;
        let error = e.message
        if(error.includes("E11000 duplicate key error collection") && error.includes("index: email_1 dup key:")){
          error = " A User with the given email is already registered"
        }
         res.render("register", {title: "Register " , username, email, error})

      }
        // const newUser = new User({
        //     email: req.body.email,
        //     username: req.body.username,
        //     image: req.body.image
        // })
          
},
/* POST REGISTER ROUTE ENDS */

/* POST LOGIN ROUTE */
 async postLogin(req, res, next){
      //  passport.authenticate('local', {
      //   successRedirect: "/",
      //   failureRedirect: "/",
      // })(req, res, next);
      const {username, password} = req.body;
      const {user,error } = await User.authenticate()(username, password)
      if(!user && error ) return next(error);
      req.login(user, function(err){
        if(err) return next(err)
        req.session.success = " Welcome Back " + username;
        const redirectUrl = req.session.redirectTo || "/";
        delete req.session.redirectTo
        res.redirect(redirectUrl)
      })
},
/* POST LOGIN ROUTE  ENDS*/



/* POST LOGOUT  ROUTE */
getLogout(req, res) {
    req.logout();
    res.redirect('/');
  },
  async getProfile(req, res, next){
    let posts = await Post.find().where("author").equals(req.user.id).limit(10).exec()
    res.render("user/profile", {posts})

  },



  async updateProfile(req, res, next){
       const {email, username } = req.body;
       let user = req.user
       if(req.file){
         //Check if the user wants to upload an image or if theres files in req.file
         //Then delete the images in cloudinary database
         //then chnage image to new image
         if(user.image.filename){
           await cloudinary.uploader.destroy(user.image.filename)
         }
       const {path, filename} = req.file
       user.image = {path, filename}

      }
       if(username || email ){
       user.email = email;
       user.username = username
       }
       await user.save()
       const login = util.promisify(req.login.bind(req))
       await login(user);
       req.session.success = "Profile Have been updated Successfuly"
       return res.redirect("/profile")

  },
  //get forget password;
  getForgotPw(req, res, next){
   res.render("user/forgot.ejs")
  },


// Put forgot password  to database

          async putForgotPw(req, res, next){
          const token = await crypto.randomBytes(20).toString("hex");
          const userEmail = req.body.email;
          const user = await User.findOne({email: userEmail})
          if(!user){
          req.session.error = " No User with Email Found";
          return res.redirect("/forgot-password")
          }


          user.resetPwToken = token;
          user.resetPwExpires = Date.now() + 3600000;
          await user.save();
          //MAILGUN CLIENT
const api_key = '4025a3ed75cde2e0d357e3ff2eb40d80-38029a9d-99a44b89'
const domain = 'sandbox32adfca65d464affbaae33da1b63541d.mailgun.org'
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});


          let  msg =  {
          from: 'Excited User <aizeogu@gmail.com>',
          to:    userEmail,
          subject: 'SurfShop Forgot Password/Reset',
          text: "Follow the Link Below to reset Your Password:   " + "http://"+ req.headers.host + "/reset/" + token
          };

           await mailgun.messages().send(msg, function (error, body) {
          if(error){
            console.log(error)
          }
          console.log(body);
          });
          req.session.success = "Password reset Email sent successfully! Check: " + userEmail;
          res.redirect("/forgot-password")
          //MAILGUN CLIENT ENDS

          },



// Get the reset password params 
          async getResetPw(req, res, next){
          const { token } = req.params;
          const user = await User.findOne({
            resetPwToken: token,
            resetPwExpires: { $gt: Date.now()}
          });
          if(!user){
            req.session.error = " Password reset token expired or invalid";
            return res.redirect("/forgot-password")
          }
          res.render("user/reset", {token})

          } ,

          // Put the  reset Password params

          
          async putResetPw(req, res, next){
          const { token } = req.params;
          const user = await User.findOne({
            resetPwToken: token,
            resetPwExpires: { $gt: Date.now()}
          });

          
          if(user && req.body.password === req.body.confirmPassword){
             console.log('this is token newwwww user:  ' + user)

            await user.setPassword(req.body.password)
            user.resetPwToken = null;
            user.resetPwExpires = null;
            await user.save()
            let login = util.promisify(req.login.bind(req));
            await login(user)
            let  msg =  {
              from: 'SurfShop <aizeogu@gmail.com>',
              to:    user.email,
              subject: 'SurfShop Forgot Password/Reset',
              text: "Hello " + user.username + " Your Password reset was successful"
            };
              
            await mailgun.messages().send(msg, function (error, body) {
              if(error){
                  console.log(error)
              }
              console.log(body);
            });
            req.session.success = " Your Password was changed successfully "
            return res.redirect('/profile')

          }
         else if(!user){
           console.log('this is not user ' + user)
            req.session.error = " Password reset token expired or invalid";
            return res.redirect("/forgot-password")
          }
          else{
            req.session.error = "Password do not match";
            return res.redirect("/reset/"+token)
          }
        
          } 

          }
          /* POST LOGOUT  ROUTE ENDS */