const express = require('express');
const router = express.Router();
const {viewSection} = require('../controllers/viewSection');

router.get("/", viewSection)
module.exports =  router;