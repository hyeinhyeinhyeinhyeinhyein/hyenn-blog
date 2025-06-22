<template>
  <div class="experienceDetail">
    <div v-if="!post">로딩 중...</div>
    <div v-else>
    <div style="font-size: 14px; color: #D9D9D9; margin-bottom: 2.5vh;">No. {{post.id}}</div>
    <div class="experience-detail-box">
      <div class="experience-detail-header">
        <div style="font-size: 22px">{{post.title}}</div>
        <div style="font-size: 18px"> {{post.englishTitle}}</div>
      </div>
      <div class="experience-detail-body">
        <viewer :initialValue="post.content" />
      </div>
    </div>
      <div class="back-to-experience-list">
        <router-link to="/experience">메뉴로 돌아가기 </router-link>
    </div>
      <div class="delete-experience" @click="deleteExperience" v-if="isLoggedIn"> 삭제하기 </div>


    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Viewer } from '@toast-ui/vue-editor'
import {loginCheck} from "@/utils/auth";


const apiUrl = process.env.VUE_APP_API_URL
export default {
  components: { Viewer },
  data() {
    return {
      post: null,
      isLoggedIn: false,
      isAdmin: false
    }
  },
  methods: {
    async deleteExperience(){
      try{
        const expId = this.$route.params.expId
        //await axios.post(`${apiUrl}/experience/delete/${expId}`, { expId }, { withCredentials: true })
        await axios.post(`${apiUrl}/experience/delete/${expId}`, {}, { withCredentials: true })
        this.$router.push('/experience')
      }catch(err){
        console.error('삭제 실패:', err.response?.data || err.message)
        alert('삭제 실패')
      }
    }
  },
  async mounted() {
    const { isLoggedIn, isAdmin } = await loginCheck()
    this.isLoggedIn = isLoggedIn
    this.isAdmin = isAdmin
    const expId = this.$route.params.expId
    try {
      const res = await axios.get(`${apiUrl}/experience/${expId}`)
      this.post = res.data.item
    } catch (e) {
      console.error('상세 조회 실패', e)
    }
  }
}
</script>

<style scoped>
.date {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 1em;
}

.experienceDetail{
  margin-top: 2.5vw;
  margin-left: 5.5vw;
  margin-right: 5.5vw;
}

.experience-detail-header{
  padding-top:2vh;
  padding-bottom: 2vh;
  padding-left: 2vw;
  padding-right: 2vw;
  background-color: #F6F6F6;
  border: 1px solid #D9D9D9;
  color:#505050;
}

.experience-detail-body{
  border: 1px solid #D9D9D9;
  margin-bottom: 3vh;
  padding-top:2vh;
  padding-bottom: 2vh;
  padding-left: 2vw;
  padding-right: 2vw;
  color: #505050;
}

.back-to-experience-list{
  margin-right: 5.5vw;
  text-align: center;
  width: 7.5vw;
  height: 5vh;
  border: 1px solid #D9D9D9;
  background-color: #F6F6F6;
  color: #505050;
  display: flex;
  align-items: center;      /* 세로 가운데 정렬 */
  justify-content: center;  /* 가로 가운데 정렬 */
}

.back-to-experience-list a {
  text-decoration: none;    /* 밑줄 제거 */
  color: inherit;           /* 부모 요소의 색상 상속 */
}

.delete-experience{
  margin-right: 5.5vw;
  text-align: center;
  width: 7.5vw;
  height: 5vh;
  border: 1px solid #D9D9D9;
  background-color: #F6F6F6;
  color: #505050;
  display: flex;
  align-items: center;      /* 세로 가운데 정렬 */
  justify-content: center;  /* 가로 가운데 정렬 */
}

.delete-experience a {
  text-decoration: none;    /* 밑줄 제거 */
  color: inherit;           /* 부모 요소의 색상 상속 */
}
</style>
