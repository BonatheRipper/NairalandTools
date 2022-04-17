
const Post = require("./models/post")
const faker = require("faker");
const Cities = require("./cities.js")


async function seedPost(){
    
await Post.deleteMany({})
for( let i=0; i< 60; i++){
    let {city, latitude, longitude, state } = Cities[i]
    
    const postData = {
       title: faker.lorem.word(),
       description: faker.lorem.text(),
       location:  city + " , " + state,
       price: Math.floor(Math.random()*6000),
       averageRating: Math.floor(Math.random()*6),
       author: "62467f96164525bf794cf6fd",
       images: [
           {
             path: 'https://picsum.photos/500/250?random=1',
             filename: i

        }
       ],
       geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
        }, 
    //    coordinates: [-122.0842499,37.4224764]
   }
   let post = new Post(postData);
   post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
   await post.save();
   }
console.log("created 600 post")
}
module.exports = seedPost

