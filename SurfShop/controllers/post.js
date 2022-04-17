const Post = require("../models/post");
const mapBoxToken = "pk.eyJ1IjoiYm9uYTlqYSIsImEiOiJja3o0bGc0NzYwZmRyMnZtZXo3ajZienBuIn0._gyNE8Ji8lR1-BlKawySvw"
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary/index');

module.exports = {
    //GET  ALL POST 
async getPost(req, res, next){
    let pageNum = function() {
        let num =  (req.protocol + "://" + req.get('host') + req.originalUrl).split("?=");
            return num[1]   
      }
      const {dbQuery} = res.locals;
      delete res.locals.dbQuery;

    let post = await Post.paginate(dbQuery, {
        page: Number(pageNum()) || 1,
        limit: 10,
        sort: {
            "_id": -1
        }
    });
    if(!post.docs.length && res.locals.query){
        res.locals.error = "No results Match that Query"

    }
    // console.log(pageNum,  Number(pageNum()))

    res.render("post/index", {post, mapBoxToken, title: "Post Index"});
},

//NEW POST ROUTE
newPost(req, res, next){
    res.render("post/new");
},

// CREATE NEW POST

async createPost(req, res, next){
    req.body.post.images = []
    for(const file of req.files){
        console.log(file)
        // let image = await cloudinary.v2.uploader.upload(file.path)
        req.body.post.images.push({
            path: file.path,
            filename: file.filename 
        })
    }

//Converting location from post to Geocoordinates
    	
		let response = await geocodingClient
		  .forwardGeocode({
              query: req.body.post.location,
		      limit: 1
		  })
		  .send();
          //Converting location from post to Geocoordinates Ends
    req.body.post.geometry = response.body.features[0].geometry;
    req.body.post.author = req.user._id
    let post = new Post(req.body.post);
		post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
		await post.save();
    // let post = await  Post.create(req.body.post);
    req.session.success = "Post Created Successfully"
    res.redirect("post/"+post.id)
},

//SHOW ALL POST
async showPost(req, res, next){
    let post = await Post.findById(req.params.id).populate({
        
        path: "reviews",
        options: {
            sort: {
            "_id": -1 }
        },
            populate: {
                path: "author",
                model: "User"
            }
    }).populate({path: "author",
    model: "User"})
    // const floorRating = post.calculateAverageRating()
    const floorRating = post.avgRating()

    res.render("post/show", {post, floorRating, mapBoxToken})
},

//EDIT POST
async editPost(req, res, next){
    res.render("post/edit")
},

//UPDATE POST
async updatePost(req, res, next){
    //find the post to be delete
    // let post =  await Post.findById(req.params.id);

    const {post} = res.locals;
    //Check if theres and exisiting image to be deleted
    if(req.body.deleteImages && req.body.deleteImages.length){
        let deleteImages = req.body.deleteImages;
        for(let filename of deleteImages){
            //deleting image from cloudinary
            await cloudinary.uploader.destroy(filename, function(error,result) {
                console.log(result,  error) });
            //deleting images from post model
            for(let image of post.images){
                if(image.filename === filename){
                    let index = post.images.indexOf(image);
                    post.images.splice(index, 1)
                }
            }
        }
    }
    //check if they are new files or images
    if(req.files){
        for(const file of req.files){
            // let image = await cloudinary.v2.uploader.upload(file.path)
            post.images.push({
                path: file.path,
                filename: file.filename
            })
        }
    }
          if(req.body.post.location !== post.location){
              
            let response = await geocodingClient
            .forwardGeocode({
                query: req.body.post.location,
                limit: 1
            })
            .send();
          post.geometry = response.body.features[0].geometry;
          post.author = req.user._id

          post.location = req.body.post.location;
         
        }
        
   
    //update post with new properties
    post.title = req.body.post.title;
    post.description = req.body.post.description;
    post.price = req.body.post.price;
    post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;

    // save post
    await post.save();
    res.redirect("/post/"+post.id)
},

//DELETE POST
async deletePost(req, res, next){
//    let post =  await Post.findById(req.params.id);
       const {post} = res.locals;

   for (let image of post.images){
    await cloudinary.uploader.destroy(image.filename, function(error,result) {
        console.log(result,  error) });
   }
     await post.remove();
     req.session.success = "Post Deleted Successfuly"
    res.redirect("/post")
}
}
