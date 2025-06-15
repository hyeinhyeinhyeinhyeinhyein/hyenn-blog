<template>
  <div class="experience-editor">
    <Editor
        ref="editor"
        height="70vh"
        initialEditType="markdown"
        previewStyle="vertical"
    />
  </div>
</template>

<script>
import { Editor } from '@toast-ui/vue-editor'
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'


export default {
  name: 'TextEditor',
  components: {Editor},
  methods: {
    getContent() {
      return this.$refs.editor.invoke('getMarkdown')
    },
  }
}
</script>

<style>
.experience-editor {
  margin-left: 5.5vw;
  margin-right: 5.5vw;
  margin-top: 5.97vh;
  height: 50%;
}

</style>
