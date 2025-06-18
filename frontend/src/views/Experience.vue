<template>
  <div class="experience-list">
    <h2>게시물 목록</h2>
    <ul>
      <li v-for="item in items" :key="item.id" class="experience-item">
        <router-link :to="`/experience/${item.id}`" class="item-link">
          <!-- 미리보기 이미지 -->
          <img
              v-if="item.preview"
              :src="item.preview"
              alt="미리보기"
              class="preview-img"
          />
          <!-- 제목 -->
          <span class="item-title">{{ item.title }}</span>
        </router-link>
        <small class="item-date">
          ({{ formatDate(item.created_at) }})
        </small>
      </li>
    </ul>
    <div class="write-link">
      <router-link to="/experience/text-editor">글쓰기</router-link>
    </div>
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
      const res = await axios.get('/save/experience'); // 필요에 따라 '/list/experience'로 수정
      this.items = res.data.items.map(item => ({
        ...item,
        preview: this.extractFirstImage(item.content)
      }));
    } catch (e) {
      console.error('목록 조회 실패', e);
    }
  },
  methods: {
    extractFirstImage(content) {
      // 1) Markdown 이미지 ![alt](url) 패턴
      const md = /!\[.*?\]\((.*?)\)/.exec(content);
      if (md && md[1]) return md[1];
      // 2) HTML <img src="url"> 패턴
      const html = /<img[^>]+src=["']([^"']+)["']/.exec(content);
      if (html && html[1]) return html[1];
      return null;
    },
    formatDate(dateString) {
      const d = new Date(dateString);
      return d.toLocaleString();
    }
  }
};
</script>

<style scoped>
.experience-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.experience-list h2 {
  margin-bottom: 1rem;
}

.experience-list ul {
  list-style: none;
  padding: 0;
}

.experience-item {
  display: flex;
  align-items: center;
  margin: 0.75em 0;
}

.item-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  flex: 1;
}

.preview-img {
  width: 150px;   /* 고정 가로 크기 */
  height: auto;   /* 세로 비율 유지 */
  margin-right: 0.75em;
  object-fit: cover;
  border-radius: 4px;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 500;
}

.item-date {
  font-size: 0.85rem;
  color: #666;
  margin-left: 0.5em;
}

.write-link {
  margin-top: 1.5rem;
  text-align: right;
}

.write-link a {
  text-decoration: none;
  color: #409EFF;
}
</style>
