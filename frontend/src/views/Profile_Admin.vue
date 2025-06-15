<template>
  <div>
    <h1>로그인 완료 🎉</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    const token = this.$route.query.token;
    if (token) {
      localStorage.setItem('authToken', token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const isAdmin = payload.isAdmin === true;
      localStorage.setItem('isAdmin', isAdmin); // 상태 저장

      this.$router.push('/'); // 홈으로 이동
    } else {
      this.$router.push('/profile'); // 토큰 없으면 로그인 페이지로 다시
    }
  }
}
</script>
