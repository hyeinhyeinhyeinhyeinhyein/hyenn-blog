<template>
  <div class="experience-editor">
    <Editor
        ref="editor"
        height="70vh"
        initialEditType="markdown"
        previewStyle="vertical"
        :options="editorOptions"
    />
  </div>
</template>

<script>
import { Editor } from '@toast-ui/vue-editor'
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
// import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
// import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import axios from "axios"

export default {
  name: 'TextEditor',
  components: { Editor },
  data() {
    return {
      editorOptions: {
        hooks: {
          addImageBlobHook: this.addImageBlobHook
        }
      }
    }
  },
  methods: {
    getContent() {
      return this.$refs.editor.invoke('getMarkdown')
    },
    async addImageBlobHook(blob, callback) {
      console.log('addImageBlobHook started!', blob)
      const formData = new FormData()
      formData.append('file', blob)

      try {
        const res = await axios.post('/save/experience-image', formData);
        callback(res.data.url, blob.name);
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        callback('', blob.name);
      }
    }
    }

}
</script>

<style>
.experience-editor {
  margin-left: 5.5vw;
  margin-right: 5.5vw;
  margin-top: 2vh;
  height: 50%;
}

/* 에디터 본문에 Pretendard 폰트 적용 */
.toastui-editor-contents {
  font-family: 'Pretendard', sans-serif;
}
</style>