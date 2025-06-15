<template>
  <div id="app" class="exprience-body">
    <TextEditor ref="textEditor"/>
    <div class = "exprience-button-box">
      <button class="exprience-save" @click="saveExperienceContent">저장하기</button>
    </div>
  </div>
</template>

<script>
import TextEditor from '@/text_editor/textEditor.vue'
import axios from 'axios'

const apiUrl = process.env.VUE_APP_API_URL
export default {
  name: 'App',
  components: { TextEditor },
  methods:{
    async saveExperienceContent() {
      try {
        const content = this.$refs.textEditor.getContent()
        console.log('콘텐츠 내용:', content)
        await axios.post(`${apiUrl}/save/experience`, { content })
        alert('저장 성공')
        this.$router.push('/experience')
      } catch (err) {
        console.error('저장 실패:', err.response?.data || err.message)
        alert('저장 실패')
      }
    }


  }
}
</script>

<style scoped>
.exprience-button-box{
  display: flex;
  justify-content: flex-end;
}

.exprience-save{
  background-color: #F6F6F6;
  border: 1px solid #D9D9D9;
  color: #505050;
  padding-left: 1vw;
  padding-right: 1vw;
  padding-top: 2px;
  padding-bottom: 5px;
  cursor: pointer;
}

.exprience-save:hover {
  background-color: #D9D9D9;
  border: 1px solid #F6F6F6;
}
</style>