const router = require('express').Router();

const { certificate } = require('../controller/appController.js')


router.post('/certificate', certificate);



module.exports = router;