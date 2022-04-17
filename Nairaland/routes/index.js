const express = require('express');
const {landingPage} = require('../controllers/index');
const {getPdf} = require('../controllers/generatePdf');


const router = express.Router();

router.get("/", landingPage)
router.get("/new", getPdf)

module.exports =  router;