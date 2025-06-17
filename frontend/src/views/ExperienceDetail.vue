<template>
  <div>
    <div v-if="!post">로딩 중...</div>
    <viewer v-else :initialValue="post.content" />
  </div>
</template>

<script>
import axios from 'axios'
import { Viewer } from '@toast-ui/vue-editor'

export default {
  components: { Viewer },
  data() {
    return { post: null }
  },
  async mounted() {
    const id = this.$route.params.id
    try {
      const res = await axios.get(`/save/experience/${id}`)
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
</style>
