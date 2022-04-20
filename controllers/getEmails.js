const Nightmare = require('nightmare');
const fs = require('fs');
const crypto = require("crypto")
let buf = crypto.randomBytes(16);
    buf = buf.toString('hex');

    module.exports = {
        async getEmails(req, res, next){

    const nightmare = Nightmare({
        show: false, // shows the chromium browser            
      });
    
       nightmare
      .goto("https://www.nairaland.com/search?q=%40gmail.com&board=0")
      .wait('body')

      .evaluate(()=>{

var word = ""
var emailArray = ["Kindly Find You Emails Below(By Izeogu Andew) "]
var table = document.querySelectorAll("table")

var format = /[ `!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;

// Loop through all the tables
for(tables of table){
    try{
      for(trow of tables.querySelectorAll("tr")){

// Loop through all table rows   and replcae line break with regex        

          for(text of trow.querySelector("td").innerText.replace(/(?:\r\n|\r|\n)/g, ' ')){

 //  loop through all text and check if text looks like email      

            if(text && !format.test(text)){
                // if text is a number add  text to word;
                word = word+text
            }
            // if text has space, break word and set it as possible email
            if(text == ' '){
               // check with regex if word is email;

               function checkIfEmailInString(email) { 
                var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
                 
                if(re.test(email)){
                    console.log(email)
                   // push to emailArrayay if it is
                    emailArray.push(email)
                };
            }
            checkIfEmailInString(word)
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
return emailArray
})
.then((data)=>{
    let buf = crypto.randomBytes(16);
    buf = buf.toString('hex');
    const file = fs.createWriteStream('../public/emails/'+buf+'.txt');
    
    file.on('error', (err) => {
      /* error handling */
    });
    for(emails of data){
       file.write(emails + "\n"); 
    }
    file.end();
  })
  .catch((e) => {
    console.log(e)
   });
}}