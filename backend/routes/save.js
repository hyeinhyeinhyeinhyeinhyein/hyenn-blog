const express = require('express');
const router = express.Router();
const { experienceSave, experienceList, experienceDetail, getExperienceImage, uploadExperienceImage, deleteExperience} = require('../controllers/textEditorSave');

router.post('/experience', experienceSave);
router.get('/experience',experienceList);
router.get('/experience/:id', experienceDetail);
router.post('/experience-image',uploadExperienceImage);
router.get('/experience-image/:id',getExperienceImage);
router.post('/experience-delete',deleteExperience);

module.exports = router;

