const express = require('express');
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const router = express.Router();

router.get('/:id',auth, sauceCtrl.getOneSauce);

router.get('/',auth, sauceCtrl.getAllSauce);

router.delete('/:id',auth, sauceCtrl.deleteSauce);

module.exports = router;