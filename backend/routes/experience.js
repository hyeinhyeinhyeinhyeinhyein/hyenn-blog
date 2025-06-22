const express = require('express');
const router = express.Router();
const { createExperience, listExperience, getExperienceDetail, getExperienceImage, uploadExperienceImage, deleteExperience} = require('../controllers/experienceController');

router.post('/', createExperience); //게시글 생성
router.get('/',listExperience); // 게시글 목록 조회
router.get('/:expId', getExperienceDetail); // 게시글 단일 조회
router.post('/delete/:expId',deleteExperience); // 게시글 삭제


router.post('/image',uploadExperienceImage); // 이미지 s3 업로드
router.get('/:expId',getExperienceImage); // 이미지 조회


module.exports = router;

