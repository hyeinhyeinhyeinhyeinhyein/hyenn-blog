const express = require('express');
const router = express.Router();
const { experienceSave,getExperienceImage, uploadExperienceImage } = require('../controllers/textEditorSave');

router.post('/experience', experienceSave);
router.post('/experience-image',uploadExperienceImage);
router.get('/experience-image/:id',getExperienceImage);


module.exports = router;

