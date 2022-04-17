const Nightmare = require('nightmare');
const fs = require('fs');
const crypto = require("crypto")
let buf = crypto.randomBytes(16);
    buf = buf.toString('hex');
const nightmare = Nightmare({
    show: false, // shows the chromium browser            
  });

  nightmare
  .goto("https://www.nairaland.com/2653841/uber-partner-lagos-please-share")
  .wait('body')
  .evaluate(()=>{

    var word = ""
    var arr = []

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
    
                    if(word.length>10 && word.length<16){
                        console.log("This is word: " + word); 
                        arr.push(word)
    
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
return arr    
  })
  .then((data)=>{
    let buf = crypto.randomBytes(16);
    buf = buf.toString('hex');
    const file = fs.createWriteStream('../public/txt/'+buf+'.txt');
    
    file.on('error', (err) => {
      /* error handling */
    });
    for(x of data){
       file.write(x + "\n"); 
    }
    file.end();
  })
  .catch((e) => {
    console.log(e)
   });
// Getting all 11 digit numbers from Nairaland Thread
// 1 Set Word to empty string

