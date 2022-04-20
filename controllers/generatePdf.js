const puppeteer = require("puppeteer");
const path = require('path');
const fs = require("fs");
const crypto = require("crypto")
const Pdf = require('../models/pdfs');

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
  
  const pdfFiles = await Pdf.find({})
  res.render("generatePdf", { pdfFiles});
  },

    async postPdf(req, res, next){
     const isValidLink = req.body.link.toLowerCase()
     
     if(isValidLink.includes("nairaland.com")){

(async () => {
    let buf = crypto.randomBytes(3);
    buf = req.body.title +"-" + buf.toString('hex');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

     await page.goto(isValidLink);
     await page.evaluate(() => {
        document.querySelector("#up > tbody > tr > td").style.display = " none"

        document.querySelector("#up > tbody > tr > td > h1 > a > img").style.display = "none"

        document.querySelector("body > div > p.bold").style.display = "none"

        document.querySelector("body > div > p:nth-child(5)").style.display ="none"

        document.querySelector("body > div > div.vertipics").style.display = "none"

    });

     async function deleteFiles(){
     var folder = './public/pdfs/';
        await Pdf.deleteMany();
     fs.readdir(folder, (err, files) => {
      if (err) throw err;
      
      for (const file of files) {
          console.log(file + ' : File Deleted Successfully.');
           fs.unlinkSync(folder+file);
      }
     
    });
     }
     deleteFiles()

  const  pdfFolder = 'pdfs/'+buf+'.pdf'
  const savePdfToDisk =  await page.pdf({ path: './public/'+pdfFolder, format: "A2", });
  if(savePdfToDisk){
      await browser.close();
      var  xx = Math.floor(Math.random()*2000)
     const pdfData = {
         title: req.body.title,
         pdfPath: pdfFolder,
         num: xx
     }
     let pdfSaveToDataBase = new Pdf(pdfData)
      pdfSaveToDataBase.save();
      console.log(pdfSaveToDataBase);
  res.redirect("/pdf");
  }
  else{
      console.log("I didnt get;  " + savePdfToDisk)
      res.render("generatePdf")
  }

  })();
     }

// //          const dirPath = path.join(__dirname, "../public/pdfs");
// //          const files =   fs.readdirSync(dirPath).map(name => {
// //         return {
// //       name: path.basename(name, ".pdf"),
// //       url: `/pdfs/${name}`
// //     };
// //   });



    }
}





