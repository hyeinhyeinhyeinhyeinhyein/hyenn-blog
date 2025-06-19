<template>
  <header class="header">
    <div>
      <!-- ✅ 로그인/로그아웃 전환 -->
      <button v-if="!isLoggedIn" @click="loginWithKakao">카카오 로그인</button>
      <button v-if="isLoggedIn" @click="logoutWithKakao">로그아웃</button>
    </div>
    <nav class="header-style">
      <div><router-link to="/profile">Profile</router-link></div>
      <div>|</div>
      <div><router-link to="/portfolio">Portfolio</router-link></div>
      <div>|</div>
      <div><router-link to="/tech">Tech</router-link></div>
      <div>|</div>
      <div><router-link to="/experience">Experience</router-link></div>

      <div class="write-link" v-if="isLoggedIn && $route.path === '/experience'">
        <router-link to="/experience/text-editor">글쓰기</router-link>
      </div>

     <router-link v-if="isAdmin" to="/admin/profile">Admin_Profile</router-link>
      <router-link v-if="isAdmin" to="/admin/portfoilo">Admin_Portfolio</router-link>

    </nav>
  </header>
</template>

<style scoped>
  .header-style{
    margin-left: 5vw;
    margin-top: 5.97vh;
  }

  .header-style{
    display: flex;
    color:#D9D9D9;
  }

  div{
    padding: 10px;
  }

  a{
    color: inherit;
    text-decoration: none;
  }

  .router-link-active {
    color: #ADCCE7; /* 강조 색 */
  }

</style>

<script>
import axios from "axios";
const apiUrl = process.env.VUE_APP_API_URL
const restApiKey = process.env.VUE_APP_REST_API_KEY

export default {
  name: 'Header',
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      testOne: false,
    };
  },
  async mounted() {
    console.log('start');
    try {
      const res = await axios.get(`${apiUrl}/kakao/logincheck`, {
        // await는 async 함수 안에서만 쓸 수 있다.
        withCredentials: true, // 쿠키 자동 전송
      });
      console.log(res);
      this.isLoggedIn = res.data.isLoggedIn;
      this.isAdmin = res.data.user?.role === 'admin'; // res에 user가 있으면, role이 admin인지 확인해라~
    } catch {
      this.isLoggedIn = false;
      this.isAdmin = false;
    }
  },
  watch: {
    '$route'() {
      this.checkLogin();
    }
  },
  methods: {
    loginWithKakao() {
      const REST_API_KEY = `${restApiKey}`
      const REDIRECT_URI = `${apiUrl}/kakao/callback`;
      window.location.href =
          `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
      },
    async checkLogin(){
      try {
        const res = await axios.get(`${apiUrl}/kakao/logincheck`, {
          // await는 async 함수 안에서만 쓸 수 있다.
          withCredentials: true, // 쿠키 자동 전송
        });
        console.log(res);
        this.isLoggedIn = res.data.isLoggedIn;
        this.isAdmin = res.data.user?.role === 'admin'; // res에 user가 있으면, role이 admin인지 확인해라~
      } catch {
        this.isLoggedIn = false;
        this.isAdmin = false;
      }
    },
    logoutWithKakao(){
      // 서버에서는 jwt 만료 시켜야 함.
      // 쿠키 삭제
      // this.isLoggedIn = false
      // this.isAdmin = false
      axios.post(`${apiUrl}/kakao/logout`, {}, {
        withCredentials: true
      }).then(() => {
        this.isLoggedIn = false;
        this.isAdmin = false;

        // 현재 경로가 "/"가 아닌 경우만 이동
        if (this.$route.path !== '/') {
          this.$router.push('/');
        }
      }).catch(err => {
        console.error('로그아웃 실패:', err);
      });
    },
  }
  }
</script>