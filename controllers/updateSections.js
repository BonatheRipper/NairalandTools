const Nightmare = require('nightmare');
const Section = require('../models/sections');

const moment = require("moment")
const time = moment().format("h:mm:ss a");
module.exports = {
    async updateSection(){
        var numCounter = 0;
        var  pages = [
       "https://www.nairaland.com/nairaland",
       "https://www.nairaland.com/politics",
       "https://www.nairaland.com/crime",
       "https://www.nairaland.com/romance",
       "https://www.nairaland.com/jobs",
       "https://www.nairaland.com/career",
       "https://www.nairaland.com/business",
       "https://www.nairaland.com/investment",
       "https://www.nairaland.com/nysc",
       "https://www.nairaland.com/education",
       "https://www.nairaland.com/autos",
       "https://www.nairaland.com/cartalk",
       "https://www.nairaland.com/properties",
       "https://www.nairaland.com/health",
       "https://www.nairaland.com/travel",
       "https://www.nairaland.com/family",
       "https://www.nairaland.com/culture",
       "https://www.nairaland.com/religion",
       "https://www.nairaland.com/food",
       "https://www.nairaland.com/diaries",
       "https://www.nairaland.com/ads",
       "https://www.nairaland.com/pets",
       "https://www.nairaland.com/agriculture",
       "https://www.nairaland.com/entertainment",
       "https://www.nairaland.com/jokes",
       "https://www.nairaland.com/tv-movies",
       "https://www.nairaland.com/music-radio",
       "https://www.nairaland.com/celebs",
       "https://www.nairaland.com/fashion",
       "https://www.nairaland.com/events",
       "https://www.nairaland.com/sports",
       "https://www.nairaland.com/gaming",
       "https://www.nairaland.com/forum-games",
       "https://www.nairaland.com/literature",
       "https://www.nairaland.com/science",
       "https://www.nairaland.com/programming",
       "https://www.nairaland.com/webmasters",
       "https://www.nairaland.com/computers",
       "https://www.nairaland.com/phones",
       "https://www.nairaland.com/graphics-video",
       "https://www.nairaland.com/techmarket"
   ]
        setInterval(function (){
            numCounter++;
            if(numCounter>=pages.length){
                numCounter=0;
            }
           const nightmare = Nightmare({
               show: false, // shows the chromium browser            
             });
          
           
            nightmare
           .goto(pages[numCounter])
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
           const foo = async () => {
          const  {
                 sectionTitle,
                 totalUsersInSection,
                 totalGuest,
                 activeFemales,
                 activeMales
               } = data

      const section = await Section.findOne({sectionTitle:sectionTitle})
                if(section){
                   section.totalGuest = totalGuest;
                   section.totalUsersInSection = totalUsersInSection
                   section.activeFemales = activeFemales;
                   section.activeMales = activeMales;
                   section.Time = time
                   await section.save();
                   console.log(section)
               }
               else{
                   let newSectionDetails = await Section.create(data);
                   console.log(newSectionDetails)
               }
      
                }
                foo()
            
         })
         .catch((e) => {
          console.log(e)
         });
   
       }, 30000)

    }
}

