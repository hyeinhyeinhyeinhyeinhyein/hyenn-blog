<template>
  <div class="experience-list">

    <!-- Masonry 레이아웃 적용 -->
    <ul class="masonry">
      <li
          v-for="item in items"
          :key="item.id"
          class="masonry-item"
      >

        <router-link
            :to="`/experience/${item.id}`"
            class="item-link"
        >
          <div class="experience-preview">
          <div class="preview-no" style="color: #D9D9D9; padding-bottom: 1.3vh; font-size: 14px"> No. {{ item.id }} </div>
          <div class="preview-header">

          <div class="preview-title" style="color: #505050; padding-bottom: 0.25vh; font-size: 14px;">{{ item.title }}</div>
            <div class="preview-english-title" style="color: #505050; font-size: 14px" >{{ item.englishTitle }}</div>
          </div>
          <div class="preview-body">
          <img
              v-if="item.preview"
              :src="item.preview"
              alt="미리보기"
              class="preview-img"
          />
          </div>
          </div>
        </router-link>

      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
const apiUrl = process.env.VUE_APP_API_URL


export default {
  name: 'ExperienceList',
  data() {
    return {
      items: []
    };
  },
  async mounted() {
    // mounted 훅에서 미리 게시글 조회
    try {
      const res = await axios.get(`${apiUrl}/experience`);
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
      const md = /!\[.*?\]\((.*?)\)/.exec(content);
      if (md && md[1]) return md[1];
      const html = /<img[^>]+src=["']([^"']+)["']/.exec(content);
      if (html && html[1]) return html[1];
      return null;
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleString();
    }
  }
};
</script>

<style scoped>
.experience-list {
  margin-top: 2.5vw;
  margin-left: 5vw;
  margin-right: 5vw;

}

.experience-preview {
}



.preview-header{
  padding-top: 1.7vh;
  padding-bottom: 1.7vh;
  padding-left: 1vw;
  padding-right: 1vw;
  background-color: #F6F6F6;
  border: 1px solid #D9D9D9;
}
.preview-body{
  border: 1px solid #D9D9D9;
}

/* Masonry 컨테이너: 3열, 간격 1rem */
.masonry {
  column-count: 5;
  column-gap: 1rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

/* 컬럼 안의 아이템: inline-block + break-inside로 분할 방지 */
.masonry-item {
  display: inline-block;
  width: 100%;
  margin-bottom: 1rem;
  break-inside: avoid;
}

/* 링크 영역 전체를 클릭 가능 */
.item-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

/* 이미지: 컬럼 폭 100% */
.preview-img {
  width: 93%;
  height: auto;
  display: block;
  object-fit: cover;
  padding-top: 0.75vh;
  padding-bottom: 0.75vh;
  padding-right: 0.75vw;
  padding-left: 0.75vw;

}

/* 제목/날짜 스타일 */
.item-title {
  display: block;
  margin: 0.5em 0 0.2em;
  font-size: 1.1rem;
  font-weight: 500;
}
.item-date {
  font-size: 0.85rem;
  color: #666;
}

/* 글쓰기 버튼 */
.write-link {
  text-align: right;
  margin-top: 1.5rem;
}
.write-link a {
  text-decoration: none;
  color: #409EFF;
}
</style>
