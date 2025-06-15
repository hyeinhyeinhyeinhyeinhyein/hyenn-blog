const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
dotenv.config()

const app = express()
const kakaoLogin = require('./routes/kakao');
const textEditorSave = require('./routes/save');

require('dotenv').config(); // .env 사용 패키지 (이거 티스토리에 써야함) npm install dotenv

const PORT = 3000

app.use(cors({
    origin: 'http://localhost:8081',
    credentials: true
})); // 모든 origin 허용 (개발 시)
app.use(express.json()); // JSON 요청 본문 처리'
app.use(cookieParser());
app.use('/kakao', kakaoLogin); // 카카오 로그인
app.use('/save', textEditorSave);


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})