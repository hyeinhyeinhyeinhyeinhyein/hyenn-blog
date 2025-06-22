const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.kakaoCallback = async (req, res) => {
    const { code } = req.query;
    const { KAKAO_REST_API_KEY, REDIRECT_URI, ADMIN_KAKAO_ID, JWT_SECRET } = process.env;
    try {
        // 1. 토큰 요청
        const tokenRes = await axios.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: KAKAO_REST_API_KEY,
                redirect_uri: REDIRECT_URI,
                code
            },
            headers: {
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        });

        const accessToken = tokenRes.data.access_token;

        // 2. 사용자 정보 요청
        const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const kakaoId = userRes.data.id;

        // 3. 관리자 확인
        if (kakaoId.toString() === ADMIN_KAKAO_ID) {

            // 4. JWT 발급
            const loginToken = jwt.sign(
                {kakaoId, role: 'admin'}, // 토큰 안에 들어갈 정보(payload)
                JWT_SECRET, //토큰이 위조되지 않도록 서명(Signature)하는 데 쓰는 비밀 키 -> .env 파일에 숨겨서 보관(공개되면 안됨)
                {expiresIn: '1h'}
            );
            //console.log(loginToken);

            // 5. JWT를 HTTP-only 쿠키로 설정
            res.cookie('login_token', loginToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Lax',
                maxAge: 60 * 60 * 1000
           });

            // 6. 리다이렉트 (쿼리스트링 없이)
            return res.redirect(`http://localhost:8081`);
        } else {
            return res.status(403).send('❌ 접근 권한이 없습니다.');
        }

    } catch (err) {
        console.error(err);d
        res.status(500).send('서버 오류');
    }
};

exports.loginStatus = (req,res) => {
    const token = req.cookies.login_token;
    if (!token) return res.status(401).json({isLoggedIn: false});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({
            isLoggedIn: true,
            user:{
                kakao: decoded.kakaoId,
                role: decoded.role
            }
        });
    }catch{
        return res.status(401).json({isLoggedIn:false});
    }
};

// 카카오 로그아웃
exports.kakaoLogout = async (req, res) => {
    res.clearCookie('login_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax', // 또는 'None' (CORS 상황에 따라)
        secure: false,   // HTTPS가 아니라면 false
    });
    res.status(200).json({ message: 'Logged out' });
};
