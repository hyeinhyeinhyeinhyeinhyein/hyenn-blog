<template>
  <div id="app" class="exprience-body">
    <div
        ref="experienceTitle"
        contenteditable="true"
        class="exprience-title-box"
        data-placeholder="여기에 글을 입력하세요…"
    ></div>
    <div
        ref="experienceEnglishTitle"
        contenteditable="true"
        class="exprience-english-title-box"
        data-placeholder="여기에 글을 입력하세요…"
    ></div>
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
        // 1) 한글 제목 추출
        const title = this.$refs.experienceTitle.textContent.trim()
        if (!title) {
          alert('제목을 입력해주세요.')
          return
        }

        // 2) 영어 제목 추출
        const englishTitle = this.$refs.experienceEnglishTitle.textContent.trim()
        if (!englishTitle) {
          alert('제목을 입력해주세요.')
          return
        }

        // 3) 본문 추출
        const content = this.$refs.textEditor.getContent()

        // 4) 서버에 title, content 함께 전송
        console.log('contents:',title,englishTitle, content)
        await axios.post(`${apiUrl}/save/experience`, { title, englishTitle, content })
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

.exprience-title-box {
  display: flex;
  align-items: center;

  height: 6vh;
  /* 최소 10px, 뷰포트 너비의 4% 크기, 최대 26px 사이에서 유동적으로 */
  font-size: clamp(7px, 4vw, 16px);

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: 5.5vw;
  margin-right: 5.5vw;
  margin-top: 5.97vh;
  box-sizing: border-box;
  border: 0.8px solid #E5E5E5;
  color: #505050;
}

.exprience-english-title-box {
  display: flex;
  align-items: center;

  height: 6vh;
  /* 최소 10px, 뷰포트 너비의 4% 크기, 최대 26px 사이에서 유동적으로 */
  font-size: clamp(7px, 4vw, 16px);

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: 5.5vw;
  margin-right: 5.5vw;
  margin-top: 1.5vh;
  margin-bottom: 1.5vh;
  box-sizing: border-box;
  border: 0.8px solid #E5E5E5;
  color: #505050;
}


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