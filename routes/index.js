const express = require('express');
const {landingPage} = require('../controllers/index');
const {getPdf, postPdf} = require('../controllers/generatePdf');

const router = express.Router();

router.get("/", landingPage)
router.get("/pdf", getPdf)
router.post("/pdf", postPdf)
module.exports =  router;