const puppeteer = require("puppeteer");
const path = require('path');
const fs = require("fs");
const crypto = require("crypto")

const url = "www.google.com"
if(!url){
    "please provide URL"
}




module.exports = {
    async getPdf(req, res, next){
//          const dirPath = path.join(__dirname, "../public/pdfs");
//          const files =   fs.readdirSync(dirPath).map(name => {
//         return {
//       name: path.basename(name, ".pdf"),
//       url: `/pdfs/${name}`
//     };
//   });



(async () => {
    let buf = crypto.randomBytes(16);
    buf = buf.toString('hex');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.nairaland.com/6343697/ubunjas-miseduca-hin-2021-ice');
     await page.evaluate(() => {
        document.querySelector("#up > tbody > tr > td").style.display = " none"

        document.querySelector("#up > tbody > tr > td > h1 > a > img").style.display = "none"

        document.querySelector("body > div > p.bold").style.display = "none"

        document.querySelector("body > div > p:nth-child(5)").style.display ="none"

        document.querySelector("body > div > div.vertipics").style.display = "none"

    });
     const close =  await page.pdf({ path: './public/pdfs/'+buf+'.pdf', format: "A2", });
  if(close){
      await browser.close();
     const fileName = buf
     const filePath = "/pdfs/"+fileName+".pdf"
  res.render("generatePdf", {  fileName, filePath});
  }
  else{
      console.log("I didnt get close")
  }

  })();

    }
}




var word = ""
var arr = []
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
                   // push to array if it is
                    arr.push(email)
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

console.log(arr)












