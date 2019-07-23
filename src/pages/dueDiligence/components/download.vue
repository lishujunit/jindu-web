<template>
  <progressbar
    :title_text="title"
    :percentage="precent"
    :progressFlag="progressFlag"
    @closeSuccess="closeSuccess"
  ></progressbar>
</template>

<script>
import request from "@/utils/request";
import progressbar from "@/components/progressBar/index";
export default {
  name: "fileDownload",
  components: {
    progressbar
  },
  props: {
    title: {
      type: String,
      default: "正在下载"
    },
    path: {
      type: String
    },
    name: {
      type: String,
      default: "download.xls"
    },
    methodType:{
      type: String,
      default: "GET"
    }
  },
  watch: {
    path() {
      if (this.path != "") {
        this.progressFlag = true;
        this.request();
      }
    }
  },
  data() {
    return {
      precent: 0,
      progressFlag: false
    };
  },
  methods: {
    closeSuccess(flag) {
      this.progressFlag = flag;
      if (this.precent == 100) {
        this.precent = 0;
      }
    },
    request() {
      let self = this;
      return request({
        url: this.path,
        method: this.methodType,
        responseType: "blob",
        onDownloadProgress: function(progressEvent) {
          // 对原生进度事件的处理
          let percentComplete = parseInt(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          self.precent = percentComplete;
        }
      }).then(res => {
        let response = res;
        let fileLink = document.createElement("a");
        fileLink.download = this.name;
        fileLink.style.display = "none";

        let blob = new Blob([response]);
        let objectURL = URL.createObjectURL(blob);
        fileLink.href = objectURL;

        document.body.appendChild(fileLink);
        fileLink.click();

        document.body.removeChild(fileLink);
        URL.revokeObjectURL(objectURL);
        this.$emit("downloadDone", false);
      });
    }
  }
};
</script>
