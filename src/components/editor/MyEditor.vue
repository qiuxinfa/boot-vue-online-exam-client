<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
  </div>
</template>

<script>
import E from "wangeditor";
// const E = process.browser ? require("wangeditor") : undefined;
export default {
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
    }
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.value);
  },
  methods: {
    seteditor() {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      // debugger;
      this.editor.config.uploadImgShowBase64 = true; // base 64 存储图片
      // this.editor.config.uploadImgServer =
      //   ""; // 配置服务器端地址
      // this.editor.config.uploadImgHeaders = {}; // 自定义 header
      // this.editor.config.uploadFileName = "file"; // 后端接受上传文件的参数名
      // this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      // this.editor.config.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
      // this.editor.config.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

      // 配置菜单
      this.editor.config.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "video", // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo", // 重复
        "fullscreen" // 全屏
      ];

      this.editor.config.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
          console.log("图片上传失败")
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
           console.log("图片上传成功")
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
           console.log("图片上传超时")
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
           console.log("图片上传错误")
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
           console.log("图片上传自定义插入")
        }
      };
      this.editor.config.onchange = html => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    }
  }
};
</script>

<style lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 500px;
}
</style>
