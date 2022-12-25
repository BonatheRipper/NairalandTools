const cloudinary = require('cloudinary').v2;

const crypto = require("crypto")
cloudinary.config({
    cloud_name: "",
    api_key: "",
    api_secret: process.env.CLOUDINARY_SECRET
}) 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   folder: 'surf-shop',
//   allowedFormats: ['jpeg', 'jpg', 'png'],
//   filename: function (req, file, cb) {
//   	let buf = crypto.randomBytes(16);
//   	buf = buf.toString('hex');
//   	let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
//   	uniqFileName += buf;
//     cb(undefined, uniqFileName );
//   }

cloudinary,
  params: async (req, file) => {
	let buf = crypto.randomBytes(16);
	buf = buf.toString('hex');
	let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
	uniqFileName += buf;
	console.log(uniqFileName)
    return {
      folder: 'surf-shop',
      format: 'jpeg',
      public_id: uniqFileName,
    };
  },
});

module.exports = {
	cloudinary,
	storage
}
