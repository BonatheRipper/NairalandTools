const Nightmare = require('nightmare');
const Section = require('../models/sections');
module.exports = {
    
 async viewSection(req, res, next){
    var files;
 const nightmare = Nightmare({
     show: false, // shows the chromium browser            
   });
  nightmare
 .goto('https://www.nairaland.com/romance')
 .wait("body > div > p.nocopy")
     .evaluate(() => {
         let text = document.querySelector("body > div > p.nocopy").textContent;
         let arr = [];
         var totalGuest = ''
          var word = "";
          var activeFemales = 0
          var activeMales = 0
          for(var i=0; i<text.length; i++){
               word = word+text[i]
               if(text[i]==' '||text[i]==':'){
                   if(word!= 'Viewing ' && word!=  'this ' && word!=  'board:' && word!=  ' ')
                   arr.push(word)
                   word = ''
               }
          }
          for(item of arr){
              if(item.includes("(m)")){
                 activeFemales = activeFemales+1
              }
              if(item.includes("(f)")){
                 activeMales = activeMales+1
             }
             if(item == 'and '){
                 totalGuest = Number(arr[arr.indexOf(item)+1])
             }
          }
         let sectionTitle = window.location.pathname.split('/')[1],
         totalUsersInSection = arr.length-5;

          return {
             'sectionTitle': sectionTitle,
            'totalUsersInSection': totalUsersInSection,
            'totalGuest': totalGuest,
            "activeFemales": activeFemales,
            "activeMales": activeMales
          };

 })
 .then((data)=>{
  console.log(data)
    files = data
    res.render("index", {show: data})
})
}
}
  

