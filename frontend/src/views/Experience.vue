<template>
  <div id="app">
  <div class="experience-list">
    <h2>게시물 목록</h2>
    <ul>
      <!-- item.id, item.title, item.created_at 등을 원하는 대로 출력 -->
      <li v-for="item in items" :key="item.id">
        <!-- 상세 페이지가 있다면 해당 경로로, 없으면 그냥 제목만 -->
        <router-link :to="`/experience/${item.id}`">
          {{ item.title }}
        </router-link>
        <small>({{ new Date(item.created_at).toLocaleString() }})</small>
      </li>
    </ul>
  </div>

    <div><router-link to="/experience/text-editor">글쓰기</router-link></div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ExperienceList',
  data() {
    return {
      items: []
    };
  },
  async mounted() {
    try {
      const res = await axios.get('/save/experience');
      this.items = res.data.items;  // { items: [...] } 구조
    } catch (e) {
      console.error('목록 조회 실패', e);
    }
  }
};
</script>

<style scoped>
.experience-list ul {
  list-style: none;
  padding: 0;
}
.experience-list li {
  margin: 0.5em 0;
}
</style>

