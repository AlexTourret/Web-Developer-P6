const express = require('express');
const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const router = express.Router();
const multer = require('../middleware/multer-config');

router.get('/:id',auth, sauceCtrl.getOneSauce);

router.get('/',auth, sauceCtrl.getAllSauce);

router.delete('/:id',auth, sauceCtrl.deleteSauce);

router.post('/', auth, multer, sauceCtrl.createSauce);

router.put('/:id', auth, multer, sauceCtrl.modifySauce);

module.exports = router;