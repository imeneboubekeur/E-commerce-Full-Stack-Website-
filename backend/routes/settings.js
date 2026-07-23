const express = require('express')
const settings = require('../controllers/settings');
const router = express.Router();

router.get('/:category',settings.getSettings);
router.put('/:key',settings.updateSetting);

module.exports = router;