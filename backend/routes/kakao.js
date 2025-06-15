const express = require('express');
const router = express.Router();
const { kakaoCallback,loginStatus ,kakaoLogout } = require('../controllers/kakaoController');

router.get('/callback', kakaoCallback);
router.get('/logincheck', loginStatus);
router.post('/logout', kakaoLogout);


module.exports = router;

