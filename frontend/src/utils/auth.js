// src/utils/auth.js
import axios from 'axios'

const apiUrl = process.env.VUE_APP_API_URL

/**
 * 서버에 쿠키를 보내서 로그인 상태를 확인합니다.
 * @returns {Promise<{isLoggedIn: boolean, isAdmin: boolean}>}
 */
export async function loginCheck() {
    try {
        const res = await axios.get(`${apiUrl}/kakao/logincheck`, {
            withCredentials: true // 쿠키 자동 전송
        })
        return {
            isLoggedIn: res.data.isLoggedIn,
            isAdmin: res.data.user?.role === 'admin' // res에 user가 있으면, role이 admin인지 확인해라~
        }
    } catch {
        return { isLoggedIn: false, isAdmin: false }
    }
}