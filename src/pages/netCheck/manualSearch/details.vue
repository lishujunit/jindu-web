<template>
  <div>
    <div class="boxBtn">
      <p class="line"></p>
      <p class="title">人工检索内部截图库</p>
      <el-button type="primary" class="fr" @click="goBack">返回</el-button>
    </div>
	<div style="margin: 15px 0px 26px;"></div>
    <div class="viewBox">
      <el-row class="imgHeadWrap">
        <el-col :span="6" class="imgHeadItem imgHeadLeft">
          <span class="txt" style="font-size:16px">
            <strong style="font-weight: bold;">图片名称：</strong>
            <span style="font-size: 14px" class="var">{{data.fileName}}</span>
          </span>
        </el-col>
        <el-col :span="12" class="imgHeadItem imgHeadCenter">
          <span class="txt" style="font-size:16px">
            <strong style="font-weight: bold;">核查主体：</strong>
            <span class="var" style="font-size: 14px">{{data.subjectName}}</span>
          </span>
        </el-col>
      </el-row>

      <div class="leftBox" style="margin-right: 0; border-right: 1px solid #d1dfe3">
        <div class="bg img-box">
          <template v-if="data.hasPrev">
            <div class="do top" @click="change('Prev')">
              <i class="el-icon-arrow-up"></i>&nbsp;上一主体
            </div>
          </template>
          <template v-else>
            <div class="do top" style="opacity: .5; cursor: none;">
              <i class="el-icon-arrow-up"></i>&nbsp;上一主体
            </div>
          </template>
          <template v-if="data.hasNext">
            <div class="do bottom" @click="change('Next')">
              <i class="el-icon-arrow-down"></i>&nbsp;下一主体
            </div>
          </template>
          <template v-else>
            <div class="do bottom" style="opacity: .5; cursor: none;">
              <i class="el-icon-arrow-down"></i>&nbsp;下一主体
            </div>
          </template>
          <div class="inner">
            <ul class="pictureList" v-if="data.filePath">
              <li>
                <img :src="data.filePath" width="100%">
              </li>
            </ul>
            <div v-else>暂无图片</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div>
    <div class="boxBtn">
      <p class="line"></p>
      <p class="title">人工检索内部截图库</p>
      <el-button type="primary" class="fr" @click="goBack">返回</el-button>
    </div>

    <div class="box view-box">
      <div class="topBox">
        <div class="txt">
          核查主体
          <span class="var">{{data.subjectName}}</span>
        </div>
        <div class="txt">
          图片名称
          <span class="var">{{data.fileName}}</span>
        </div>
      </div>
      <div class="bg img-box">
        <div class="inner">
          <ul class="imgList">
            <li>
              <img :src="data.filePath">
            </li>
          </ul>
          <div class="do top" @click="change('Prev')" v-if="data.hasPrev">
            <i class="el-icon-arrow-up"></i>&nbsp;上一主体
          </div>
          <div class="do bottom" @click="change('Next')" v-if="data.hasNext">
            <i class="el-icon-arrow-down"></i>&nbsp;下一主体
          </div>
        </div>
      </div>
    </div>
  </div>-->
</template>
<script>
import { getManualById, getManualUpOrDown } from "@/api/project";
import { MessageBox } from 'element-ui'
export default {
  data() {
    return {
      id: "",
      data: {},
      form: {},
      isChange: true
    };
  },
  methods: {
    goBack() {
      if (!this.view) this.$router.go(-1);
      else this.view = false;
    },
    change(action) {
      let options = this.form;
      options.action = action;
      options.id = this.id;
      getManualUpOrDown(options).then(res => {
        this.data = res.result;
        this.id = res.result.id;
        this.isChange = true;
      });
    },
    handleChange(event){
      event.preventDefault();
      if(!this.isChange) return;
      let code = event.code;
      this.isChange = false;
      if(code == 'ArrowUp' || code == 'ArrowLeft'){
        if(this.data.hasPrev){
          this.change('Prev')
        }else{
          MessageBox.alert('没有可查看的主体','提示',{
            type:'warning',
            confirmButtonText: '确定',
            callback: () => {
              this.isChange = true
            }
          })
        }
      }else if(code == 'ArrowDown' || code == 'ArrowRight'){
        if(this.data.hasNext){
          this.change('Next')
        }else{
          MessageBox.alert('没有可查看的主体','提示',{
            type:'warning',
            confirmButtonText: '确定',
            callback: () => {
              this.isChange = true
            }
          })
        }
      }
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.form = this.$route.query;
    let options = {
      id: this.id,
      params: this.form
    };
    getManualById(options).then(res => {
      if (res.code == 0) {
        this.data = res.result;
      }
    });
    document.body.addEventListener('keyup', this.handleChange, false)
  },
  beforeDestroy(){
    document.body.removeEventListener('keyup', this.handleChange)
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
@import "@/assets/css/viewImage.scss";
.boxBtn {
  overflow: hidden;
  > div {
    float: left;
  }
  .fr {
    float: right;
  }
  .title {
    float: left;
    color: $txt-color;
    font-size: 16px;
    line-height: 28px;
    position: relative;
    font-weight: 600;
  }

  .line {
    float: left;
    content: "";
    width: 5px;
    height: 28px;
    background-color: $global-color;
    margin-right: 8px;
  }
}
</style>
