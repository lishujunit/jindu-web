<template>
  <progressbar
    :title_text="title"
    :percentage="precent"
    :progressFlag="progressFlag"
    @closeSuccess="closeSuccess"
  ></progressbar>
</template>

<script>
import { getToken } from "@/utils/auth";
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
    params: {
      type: Object
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
    urlParam(url, name, value) {
      //encodeURIComponent
      let param = "?";
      for (var v in this.params) {
        param += v + "=" + this.params[v] + "&";
      }
      param = param.substring(0, param.length - 1);
      return param;
    },
    closeSuccess(flag) {
      this.progressFlag = flag;
      if (this.precent == 100) {
        this.precent = 0;
      }
    },
    request() {
      let self = this;
      let contentLength = 0;
      let xhr = new XMLHttpRequest();
      let url = '';
      if (self.params) {
        url = self.path + self.urlParam();
      }else{
        if(self.path.indexOf(process.env.VUE_APP_BASEURL) > -1){
          url = self.path
        }else{
          url = process.env.VUE_APP_BASEURL + self.path;
        }
      }
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      if (getToken()) {
        xhr.setRequestHeader("accessToken", getToken());
        xhr.setRequestHeader("Authorization", "Bearer " + getToken());
      }
      xhr.addEventListener(
        "progress",
        function(evt) {
          let total =
            evt.lengthComputable > 0
              ? evt.total
              : xhr.getResponseHeader("Custom-Content-Length"); //获取文件长度
          //console.log(total, 'total', evt.loaded)
          contentLength = total;
          if (total > 0) {
            let percentComplete = parseInt((evt.loaded / total) * 100);
            self.precent = percentComplete;
          } else {
            self.progressFlag = false;
          }
        },
        false
      );
      xhr.onreadystatechange = function() {
        self.progressFlag = false;
        if (xhr.readyState === 4 && xhr.status === 200) {
          if(contentLength > 0){
            self.$message({
              message: '下载完成',
              type: 'success'
            });
          }else{
            self.$message({
              message: '下载的文件不存在',
              type: 'warning'
            });
          }
        }
      };
      xhr.onload = function() {
        if(contentLength > 0){
          let response = xhr.response;
          let fileLink = document.createElement("a");
          fileLink.download = self.name;
          fileLink.style.display = "none";

          let blob = new Blob([response]);
          let objectURL = URL.createObjectURL(blob);
          fileLink.href = objectURL;

          document.body.appendChild(fileLink);
          fileLink.click();

          document.body.removeChild(fileLink);
          URL.revokeObjectURL(objectURL);
          self.$emit("downloadDone", false);
          self.precent = 100;
          self.progressFlag = false;
        }
      };
      xhr.send(null);

      // let self = this;
      // return request({
      //   url: this.path,
      //   method: "GET",
      //   params: this.params,
      //   responseType: "blob",
      //   onDownloadProgress: function(progressEvent) {
      //     console.log('dow', progressEvent)
      //     // 对原生进度事件的处理
      //     if(progressEvent.lengthComputable){
      //       let loaded = progressEvent.loaded;
      //       let total = progressEvent.total;
      //       let percentComplete = parseInt(
      //         loaded / total * 100
      //       );
      //       console.log(percentComplete)
      //       self.precent = percentComplete;
      //     }else{
      //       self.precent = 100
      //     }
      //   }
      // }).then(res => {
      //   let response = res;
      //   let fileLink = document.createElement("a");
      //   fileLink.download = this.name;
      //   fileLink.style.display = "none";

      //   let blob = new Blob([response]);
      //   let objectURL = URL.createObjectURL(blob);
      //   fileLink.href = objectURL;

      //   document.body.appendChild(fileLink);
      //   fileLink.click();

      //   document.body.removeChild(fileLink);
      //   URL.revokeObjectURL(objectURL);
      //   this.$emit("downloadDone", false);
      // });
    }
  }
};
</script>
