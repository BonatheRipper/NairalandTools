            const Post = require("../models/post");
            const User = require("../models/user");
            const {cloudinary} = require("../cloudinary/index");
            const mapBoxToken = "pk.eyJ1IjoiYm9uYTlqYSIsImEiOiJja3o0bGc0NzYwZmRyMnZtZXo3ajZienBuIn0._gyNE8Ji8lR1-BlKawySvw"
            const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
            const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken});


            function escapeRegExp(string) {
                return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
            }

            const middleware = {
                asyncErrorHandler: (fn) => 
                    (res, req, next) => {
                        Promise.resolve(fn(res, req, next))
                        .catch(next);
                },
                isLoggedIn: async (req, res, next)=>{
                if(req.isAuthenticated()){return next()}
                req.session.error = "You Need to be Logged in to do that";
                req.session.redirectTo = req.originalUrl
                res.redirect("/login")
                },
                isAuthor: async (req, res, next)=>{
                    const post = Post.findById(req.params.id)
                    if(post.author.equals(req.user._id)){
                        res.locals.post = post
                        return next();
                    }
                    req.session.error = 'Not Authorized!'
                    res.redirect('back')
                },
                // We use req.user.username becuase the user should already be authenticated.

                isValidPassword: async (req, res, next)=>{
                    let {currentPassword} = req.body;
                    const { user } = await User.authenticate()(req.user.username, currentPassword)
                    if(user){
                        res.locals.user = user;
                        console.log(user +" this is user in isValidpASSWORD")
                    next()
                    }else{
                        middleware.deleteProfileImage(req)
                    req.session.error = "Incorrect Credentials"
                    return   res.redirect("/profile")
                    }

                },
                changePassword: async (req, res, next)=>{
                    const { newPassword, confirmPassword} = req.body;
                    if(newPassword && !confirmPassword){
                        middleware.deleteProfileImage(req)
                        req.session.error = " Missing Password confirmatio"
                        return res.redirect("/profile")

                    }

                    //Checking if new password and confirmaton password exist
                    if( newPassword && confirmPassword){
                        const {user} = res.locals
                        if(newPassword === confirmPassword){
                            await user.setPassword(newPassword)
                            req.session.success = "Password Changed Successfully"
                            next()
                        }
                        else{
                            middleware.deleteProfileImage(req)
                            req.session.error = "Password Do Not Match"
                            return res.redirect("/profile");
                        }
                    }
                    else{
                    return next()
                    }
                },
                deleteProfileImage: async req =>{
                    if(req.file) await cloudinary.uploader.destroy(req.file.filename)
                },
                async  searchAndFilterPosts(req, res, next){
                    const queryKeys = Object.keys(req.query);
                    if(queryKeys.length){
                        const DbQueries = [];
                        let { search, price, location, avgRating, distance} = req.query;
                        if(search){
                            search = new RegExp(escapeRegExp(search), "gi");
                        DbQueries.push({
                            $or: [
                                {title: search},
                                {description: search},
                                {location: search}
                            ]
                        })
                    }
                    if(location){
                        const response = await geocodingClient
                        .forwardGeocode({
                            query: location,
                            limit: 1
                        })
                        .send()
                        const coordinates = response.body.features[0].geometry;
                        let maxDistance = distance || 25;
                        maxDistance*= 1609.34;
                        dbQueries.push({
                            geometry: {
                                $near: {
                                $geometry:  {
                                    type: " Point",
                                    coordinates
                                },
                                $maxDistance: maxDistance
                                }
                            }
                        })
                    }
            if(price){
                if(price.min) dbQueries.push({price: {$gte: price.min} })
                if(price.max) dbQueries.push({price: {$lte: price.max} })
            }
            if(avgRating){
                dbQueries.push({avgRating: {$in: avgRating}})
            }
            res.locals.dbQuery = dbQueries.length ? {$and: dbQueries} : {};
                }
                res.locals.query = req.query;
                queryKeys.splice(queryKeys.indexOf("page"), 1);
                const delimeter = queryKeys.length ? "&" : "?";
                res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, "") + `${delimeter}page=`
                next()
                }
            };























            module.exports = middleware;