const Nightmare = require('nightmare');
const fs = require('fs');
const crypto = require("crypto")
let buf = crypto.randomBytes(16);
    buf = buf.toString('hex');

module.exports = {
  async getNumbers(req, res, next){
    const nightmare = Nightmare({
      show: false, // shows the chromium browser            
    });
  
     nightmare
    .goto("https://www.nairaland.com/search?q=080&search=Search")
    .wait('body')
    .evaluate(()=>{
  
      var word = ""
      var phoneNumbersArray = ["Kindly Find Your Numbers Below (By Izeogu Andew) "]
  
      var table = document.querySelectorAll("table")
      
      // Loop through all the tables
      for(tables of table){
          try{
            for(trow of tables.querySelectorAll("tr")){
      
      // Loop through all table rows          
      
                for(text of trow.querySelector("td").textContent){
      
       //  loop through all text of table rows then cheeck if text is a number;       
      
                  if(isNaN(text)==false){
                      // if text is a number add  text to word;
                      word = word+text
                  }
                  // if text has space break word and set it as possible number
                  if(text == ' '){
                     // if word length is greate than 10 or less than 16 then we found a number;
      
                      if(word.length>10 && word.length<13){
                          phoneNumbersArray.push(word)
                          word = ''
      
                          // print word
                      }
                      //set word back to  empty number snd repeat " "
      
                      word = ""
                  }
                }
            }
          }
         catch(e){
             console.log(e)
         }
      }
  return phoneNumbersArray    
    })
    .then((data)=>{
      console.log('this is data length '+ data.length)
      let buf = crypto.randomBytes(16);
      buf = buf.toString('hex');
      const file = fs.createWriteStream('../public/phones/'+buf+'.txt');
      
      file.on('error', (err) => {
        /* error handling */
      });
      for(phoneNumbers of data){
         file.write(phoneNumbers + "\n"); 
      }
      console.log("done")
      file.end();
    })
    .catch((e) => {
      console.log(e)
     });
  // Getting all 11 digit numbers from Nairaland Thread
  // 1 Set Word to empty string
  }
}

