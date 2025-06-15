const express = require('express');
const router = express.Router();
const { experienceSave, experienceImgSave,getExperienceImage } = require('../controllers/textEditorSave');

router.post('/experience', experienceSave);
router.post('/experience-image', experienceImgSave);
router.get('/experience/image/:id', getExperienceImage)

module.exports = router;

