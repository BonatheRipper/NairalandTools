const Num = require('../models/user2');
const mongoose = require("mongoose")

// async function n(){
//     const cursor = User.find().cursor();
//     for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
//         if(doc.numOne%1000 ==0){
//                   console.log(doc.username+" || "+ doc.numOne)

//         }
// //     }
// // }
// // n()

 async function add(){
    //  mongoose.connect('mongodb+srv://bona9ja:11112222*++BoNa@cluster0.0gohh.mongodb.net/Example?retryWrites=true&w=majority', err => {
    //     if (err) throw err;
    //     console.log('connected to MongoDB')
    //   })
    const user = await Num.findById('625862fa0512731a086024ab');
    user.num = user.num+1;
    await user.save();
    console.log(user)
}
add();
// const forLoop = async ()=>{
//     var pages = ['romance', 'politics', 'Jokes', 'Celebrities', 'Fashion', 'Events', 'Sports', 'Gaming', 'Literature']
//     num++
//     nightmare
//   .goto('https://www.nairaland.com/'+pages[i])
// //   .type('#search_form_input_homepage', 'github nightmare')
// //   .click('#search_button_homepage')
// .wait(20)
//   .wait('body > div > p.nocopy')
//   .evaluate(() => {
//     let spans =     document.querySelector("body > div > p.nocopy").querySelectorAll("span").length;
//     let datass =   spans + " || "+ pages[i]
//     return datass;
// })
//   .end()
//   .then(console.log)
//   .catch(error => {
//     console.error('Search failed:', error)
//   })

//  }

// forLoop()