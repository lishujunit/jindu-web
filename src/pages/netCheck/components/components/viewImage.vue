<template>
  <div class="viewBox">
    <el-row class="imgHeadWrap">
      <el-col :span="6" class="imgHeadItem imgHeadLeft">
        <span class="txt" style="font-size:16px">
          <strong style="font-weight: bold;">图片名称：</strong>
          <span
            style="font-size: 14px"
            class="var"
            v-if="main.subject && main.pictureList.length>0"
          >{{main.pictureList[current-1].name}}</span>
        </span>
      </el-col>
      <el-col :span="12" class="imgHeadItem imgHeadCenter">
        <span class="txt" style="font-size:16px">
          <strong style="font-weight: bold;">核查主体：</strong>
          <span class="var" style="font-size: 14px">{{main.subject}}</span>
        </span>
        <span v-if="main.subjectWebsiteId.split('-')[1]!=55" style="font-size:14px; margin-left: 30px">
          当前图片类型
          <el-select v-model="form.picType" size="mini" @change="togoType" style="width: 100px;">
            <el-option value="01" label="正文图片"></el-option>
            <el-option value="00" label="列表图片"></el-option>
          </el-select>
        </span>

      </el-col>
      <el-col :span="6" class="imgHeadItem imgHeadRight" v-if="!relatedManuscript && isShowOperating">
        <el-button
          class="border-danger"
          type="danger"
          v-if="main.pictureList&&main.pictureList.length>0"
          @click="deleteImg"
        >删除</el-button>
        <el-button class="border-danger" type="danger" @click="reCrawl">重新爬取</el-button>
        <template v-if="(source != 1)">
          <!-- source:0校验资料 1审核资料 -->
          <template v-if="form.picType=='01'">
            <!-- form.picType:01正文图片 00列表图片 -->
            <el-button
            type="primary"
            :disabled="!show"
            @click="Confirmation"
          >确认并提交</el-button>
          </template>
          <template v-else>
            <template v-if="form.websiteId == '55'">
              <!-- form.websiteId 55(百度) -->
              <el-button
              type="primary"
              :disabled="!show"
              @click="Confirmation"
            >确认并提交</el-button>
            </template>
          </template>

        </template>

        <el-button
          v-if="(source==1)"
          type="danger"
          @click="unpass"
        >不合格</el-button>
      </el-col>
    </el-row>
    <div class="rightBox fr" :style="{height: imgBoxHeight+140 + 'px'}">
      
      <div class="mark-box" v-if="!relatedManuscript && isShowOperating">
        <div class="mark">
          <template v-if="form.picType=='01'">
            <!-- 如果为正文图片 01-->
            <template v-if="main.pictureList&&main.pictureList.length>0">
              <template v-if="main.pictureList[current-1].isMark=='N'"><i class="icon-mark markN" style="color:#333"  @click="doMark('Y')">标记</i></template>
              <template v-if="main.pictureList[current-1].isMark=='Y'"><i class="icon-mark markY" @click="doMark('N')">标记</i></template>
              <textarea
                id="markTextarea"
                @change="remarkChange"
                v-model="main.pictureList[current-1].remark"
                maxlength="100"
                rows="10"
                placeholder="请输入标记备注"
                class="el-textarea__inner"
                style="min-height: 31px;"
              ></textarea>
            </template>
          </template>
          <template v-else>
            <!-- 如果为列表图片 00-->
            <template v-if="main.subjectWebsiteId.indexOf('-55-')>-1">
              <!-- 如果为百度站点主体 -->
              <template v-if="main.pictureList&&main.pictureList.length>0">
                <template v-if="main.pictureList[current-1].isMark=='N'"><i class="icon-mark markN"  @click="doMark('Y')">标记</i></template>
                <template v-if="main.pictureList[current-1].isMark=='Y'"><i class="icon-mark markY" @click="doMark('N')">标记</i></template>
                <textarea
                  id="markTextarea"
                  @change="remarkChange"
                  v-model="main.pictureList[current-1].remark"
                  maxlength="100"
                  rows="10"
                  placeholder="请输入标记备注"
                  class="el-textarea__inner"
                  style="min-height: 31px;"
                ></textarea>
              </template>
            </template>
          </template>
        </div>
        <div class="operate-box"> <!-- v-if="expand" -->
          <upload-pic
            accept=".png, .bmp, .gif, .jpeg"
            class="operate"
            type="primary"
            text="补充上传"
            @uploadSuccess="fillUpload"
          ></upload-pic>
          <!-- <p style="height: 13px;border-top: 1px dotted#ccc;"></p> -->
          <!-- <el-button
            class="operate"
            type="danger"
            v-if="main.pictureList&&main.pictureList.length>0"
            @click="deleteImg"
          >删除</el-button> -->
          <!-- <upload-pic accept=".png,.bmp,.gif,.jpeg" class="operate" type="danger" v-if="main.pictureList&&main.pictureList.length>0" text="删除并重传" @uploadSuccess="reUpload"></upload-pic> -->
          <!-- <el-button class="operate" type="danger" @click="reCrawl" style="margin-left: 1px;">重新爬取</el-button> -->
        </div>
        <!-- <div class="var under" @click="expand=!expand">{{expand?'收起':'展开'}}&nbsp;&gt;</div> -->
      </div>
    </div>
    <div class="leftBox" v-if="main.subject">
      
      <div class="bg img-box" v-loading="imgLoading">
        <template v-if="isPrev && cancelReview==false">
          <div class="prev arrow" @click="prev"></div>

        </template>
        <template v-else>
          <div class="prev arrow" style="opacity: .5; cursor: none;"></div>
        </template>

        <!-- <div class="prev arrow" v-if="(current==1&&main.hasPrev)" @click="prev">
            <template v-if="!cancelReview">
            </template>
            <template v-else>
              <i class="el-icon-loading"></i>
            </template>
          </div> -->

        <!-- isNext -->
        <template v-if="isNext && cancelReview==false">
          <div class="next arrow" @click="next"></div>
        </template>
        <template v-else>
          <div class="next arrow" style="opacity: .5; cursor: none;"></div>
        </template>

          <!-- <div
            class="next arrow"
            v-if="(source==0&&form.websiteId==55)||!(!main.hasNext&&current==main.pictureList.length&&(source==1||(source==0&&form.picType=='00')))"
            @click="next"
          >
            <template v-if="!cancelReview">
            </template>
            <template v-else>
              <i class="el-icon-loading"></i>
            </template>
          </div> -->
          <div class="imgPage">
            <el-checkbox class="fl" v-if="source==1 && form.picType == '01'" v-model="isMark" @change="changeMark">只看被标记的</el-checkbox>
            <input type="text" v-model="number"  @blur="changePage" @keyup.enter="changePage" class="pageInput"/>
            &nbsp;/&nbsp;{{main.pictureList.length}}
            <template v-if="(main.subjectWebsiteId.split('-')[1]==55 || main.subjectWebsiteId.split('-')[1]==25)">
              <!-- 百度和证监会 -->
              <template v-if="form.picType=='00'">
                <template v-if="main.excelFilePath == ''"> <span style="color:#999; text-decoration: none; margin-left: 15px;">查看清单</span></template>
                <template v-else> <span  @click="viewExcel" class="var" style="text-decoration: underline; cursor: pointer; margin-left: 15px;">查看清单</span></template>
              </template>
            </template>
          </div>
            <!-- v-if="main.hasPrev" -->
            <template v-if="!cancelReview && main.hasPrev && !isSubject">
              <div class="do top" @click="change('Prev')"><i class="el-icon-arrow-up"></i>&nbsp;上一主体</div>
            </template>
            <template v-else>
              <div class="do top" style="opacity: .5; cursor: none;"><i class="el-icon-arrow-up"></i>&nbsp;上一主体</div>
            </template>

            <!-- v-if="main.hasNext" -->
            <template v-if="!cancelReview && main.hasNext && !isSubject">
              <div class="do bottom" @click="change('Next')"><i class="el-icon-arrow-down"></i>&nbsp;下一主体</div>
            </template>
            <template v-else>
              <div class="do bottom" style="opacity: .5; cursor: none;"><i class="el-icon-arrow-down"></i>&nbsp;下一主体</div>
            </template>

          <!-- <div class="do bottom" v-if="main.hasNext" @click="change('Next')">
            <template v-if="!cancelReview">
              <i class="el-icon-arrow-down"></i>&nbsp;下一主体
            </template>
            <template v-else>
              <i class="el-icon-loading"></i>
            </template>
          </div> -->
        <div class="inner" :style="{height: imgBoxHeight + 'px'}">
          <ul class="pictureList" v-if="main.pictureList.length>0">
            <li>
              <img :src="visibleImg" width="100%">
            </li>
            <!-- <li v-for="item,index in main.pictureList" v-show="index==current-1">
              <img :src="item.url" style="width: 100%">
            </li> -->
          </ul>
          <div v-else>暂无图片</div>

        </div>
      </div>
    </div>
    <div class="line"></div>
  </div>
</template>
<script>
import { previewFile } from "@/utils/api";
import { MessageBox } from 'element-ui'
import {
  crawlinfo,
  deletePic,
  markPic,
  delandupload,
  upload,
  recollect,
  reviewCheck,
  crawlinfoByCurrent,
  cancelReview,
  reviewFailure,
  getMatterStatus
} from "@/api/project";
import uploadPic from "@/components/upload";
export default {
  components: {
    uploadPic
  },
  watch: {
    current() {
      // if(this.current == this.main.pictureList.length){ //判断提交按钮是否显示
      //   if(this.source != 1 && form.picType == '01'){
      //     this.show = true
      //   }
      // }

      let self = this;
      if(self.current != 0){
        self.imgLoading = true
      }
      if(t){return}
      let t = setTimeout(()=>{
        this.number = this.current;
        if (
          this.source == 0 &&
          (this.form.picType == "01" ||
            (this.form.picType == "00" &&
              this.main.subjectWebsiteId.split("-")[1] == 55)) &&
          this.current == this.main.pictureList.length &&
          this.main.pictureList.length > 0
        ) {
          this.cancelReview = true;
          this.show = true
          cancelReview(this.main.subjectWebsiteId).then(res => {
            if(res.code==0){
              this.cancelReview = false
            }
          }).catch(() => {
            this.cancelReview = false
          });
        }
        // else{
        //   this.show = false
        // }
        let current = this.current;
        let imgList = this.main.pictureList;
        if(current > 0 && imgList.length > 0){
          let img=new Image();
          img.onload=function(){
            console.log('loaded')
            self.visibleImg = imgList[self.current-1].url
            self.imgLoading = false
            img = null;
          };
          img.onerror=function(){
            console.log('error')
            self.imgLoading = false
          };
          img.src=imgList[this.current-1].url;
        }
      }, 500)
    },
    main(){
      if(this.current != 0){
        this.visibleImg = this.main.pictureList[this.current-1].url
      }
    }
  },
  computed:{
    isShowOperating(){
      let status = getMatterStatus()
      return status
    },
    isErrorBtn(){
      let status = false;
      if(source==1){
        status = true;
      }
      // (source==1 || main.subjectWebsiteId.indexOf('55'))&& form.picType =='01'
      // let status = true;
      return status
    },
    isPrev(){
      let status = true;
      if(this.main.hasPrev){
        if(this.cancelReview == false && this.isSubject == false){
          status = true;
        }else{
          status = false;
        }
      }else{
        if(this.current > 1 && this.cancelReview == false && this.isSubject == false){
          status = true;
        }else{
          status = false
        }
      }
      return status
    },
    isNext(){
      let status = true;
      if(this.main.hasNext){
        if(this.cancelReview == false && this.isSubject == false){
          status = true;
        }else{
          status = false;
        }
      }else{
        if(this.current != this.main.pictureList.length && this.cancelReview == false && this.isSubject == false){
          status = true;
        }else{
          status = false
        }
      }
      return status
    }
    // markImgData(){
    //   let pictureList = JSON.stringify(this.main.pictureList)
    //   let markImgData = [];
    //   if(pictureList != undefined && pictureList.length > 0){
    //     let imgData = JSON.parse(pictureList);
    //     imgData.forEach((v,i)=>{
    //       if(v.isMark === 'Y'){
    //         markImgData.push(v)
    //       }
    //     })
    //     return markImgData
    //   }
    // }
  },
  data() {
    return {
      relatedManuscript: false, //判断是否为关联底稿查看页面
      //baiduForm: false,
      status: Number, //是否有标记（0无，1有）
      reason: "",
      projectNo: "",
      listPicId: "", //列表图片的id
      form: {},
      source: 0, //0：校验 1：审核
      loading: false,
      main: {}, //图片信息
      current: 0, //当前图片的index
      number: 0, //图片页数的输入框
      isMark: false, //是否查看标记的
      expand: false, //是否展开
      show: false,
      reCrawlData:null,
      EventUtil: {
        addHandler: function(element, type, handler) {
          if (element.addEventListener) {
            element.addEventListener(type, handler, false);
          } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
          } else {
            element["on" + type] = handler;
          }
        },
        removeHandler: function(element, type, handler) {
          if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
          } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
          } else {
            element["on" + type] = null;
          }
        }
      },
      visibleImg: '', //当前可见图片路径
      imgLoading: false,
      imgData: [],
      markImgData:[],
      cancelReview: false,
      isSubject: false,
      isMessageBox: false,
      imgBoxHeight: window.innerHeight - 350
    };
  },
  methods: {
    changeMark(){
      if(this.isMark){
        let imgData = JSON.parse(JSON.stringify(this.imgData))
        this.markImgData = imgData.filter(v=>{
          return v.isMark == 'Y'
        })
        this.main.pictureList = this.markImgData
        if(this.markImgData.length == 0){
          this.current = 0
        }else{
          this.current = 1
        }
      }else{
        this.main.pictureList = this.imgData
        if(this.imgData.length == 0){
          this.current = 0
        }else{
          this.current = 1
        }
      }
      if(this.main.pictureList.length && this.current > 0){
        this.visibleImg = this.main.pictureList[this.current-1].url
      }
      
    },
    //切换主体
    change(type, obj) {
      //console.log(obj.option, 'obj')
      //return
      if(this.imgLoading){
        return false;
      }
      if(this.isSubject){
        return false;
      }
      //this.change('Next', {type: 'unpass', option: options})
      this.isSubject = true;
      let options = { source: this.source, data: this.form, projectNo: this.projectNo };
      if (this.source == 1) options.data.type = this.form.picType;
      options.data.action = type;
      options.data.subjectWebsiteNum = this.main.subjectWebsiteId;
      if (this.isMark && this.form.picType == '01') options.data.flaged = true;
      this.loading = true;
      crawlinfoByCurrent(options).then(res => {
        if (res.code == 0) {
          if(obj){
            if(obj.type == 'reCrawl'){ //重新爬取
              recollect(obj.option).then(res => {
                if(res.code == 0){
                }
              })
            }
            if(obj.type == 'unpass'){ //不合格
              reviewFailure(obj.option).then(res => {
                if (res.code == 0) {
                  //
                }
              });
            }
            
          }
          
          this.isSubject = false;
          
          //this.Confirmation()
          this.show = false;
          this.main = res.result;
          this.imgDataProcessing() //处理图片数据，分离标记的数据和全部数据
          this.loading = false;
          if (this.main.pictureList.length == 0) this.current = 0;
          else {
            this.current = 1;
            this.number = this.current;
            if (
              this.source == 0 &&
              (this.form.picType == "01" ||
                (this.form.picType == "00" &&
                  this.main.subjectWebsiteId.split("-")[1] == 55)) &&
              this.current == this.main.pictureList.length &&
              this.main.pictureList.length > 0
            ) {
              this.cancelReview = true;
              cancelReview(this.main.subjectWebsiteId).then(res => {
                if(res.code==0){
                  this.cancelReview = false
                }
              }).catch(() => {
                this.cancelReview = false
              });
            }
          }
          if(this.current == this.main.pictureList.length){
            if(this.source != 1){
              if(this.form.picType == '01'){
                this.show = true
              }else{
                if(this.form.websiteId == '55'){
                  this.show = true
                }
              }
            }
          }
        
        //this.imgData = this.main.pictureList ? JSON.parse(JSON.stringify(this.main.pictureList)) : [] //获取主体全部图片
      }
      else if(res.code==1000){ //没有更多主体
        if(type == 'Prev'){
          this.main.hasPrev = false;
          this.cancelReview = false;
          this.isSubject = false;
        }else{
          //this.main.hasPrev = false;
        }
      }
      });
    },
    remarkChange() {
      let isMark = this.main.pictureList[this.current - 1].isMark;
      this.doMark("Y");
      // if(isMark == 'Y'){
      //   this.doMark('Y')
      // }
    },
    //做标记
    doMark(is) {
      //console.log(is)
      //this.baiduForm = true;
      let imgData = this.imgData;
      let markImgData = this.markImgData;
      let picId = this.main.pictureList[this.current - 1].picId;
      if(imgData.length){
        imgData.forEach(v=>{
          if(v.picId == picId){
            v.isMark = is
          }
        })
      }
      if(markImgData.length){
        imgData.forEach(v=>{
          if(v.picId == picId){
            v.isMark = is
          }
        })
      }
      
      this.main.pictureList[this.current - 1].isMark = is;
      //if(is=='N') this.main.pictureList[this.current - 1].remark=''
      let options = {
        isMark: is,
        picId: this.main.pictureList[this.current - 1].picId,
        remark: this.main.pictureList[this.current - 1].remark.replace(/[\r\n]/g,"")
      };
      let markTextarea = document.getElementById('markTextarea');
      if(is == 'N'){
        delete options.remark;
        markTextarea.blur();
      }else{
        markTextarea.focus()
      }
      markPic(options)
        .then(res => {
          this.loading = true;
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: "操作成功！"
            });

            if (this.source == "1" && is == "N" && this.isMark) {
              if (this.current == 1 && this.main.pictureList.length > 1) {
                this.main.pictureList.splice(0, 1);
              } else {
                this.current--;
                this.main.pictureList.splice(this.current, 1);
              }
            }
          }
        })
        .catch(() => {
          //this.loading = false
        });
    },
    //修改当前页面
    changePage() {
      !/^[0-9]*[1-9][0-9]*$/.test(this.number) ||
      this.number > this.main.pictureList.length ||
      this.number < 1
        ? (this.number = this.current)
        : (this.current = this.number);
      console.log(this.number);
      //this.show = true; //2019/4/15 新需求修改，弹框修改成 按钮
    },
    //切换正文和列表页
    togoType() {
      //this.form.picType = this.form.picType == "01" ? "00" : "01";
      this.getImgList(1);
    },
    next() {
      if(this.imgLoading){
        return false;
      }
      if (
        this.source == 0 &&
        (this.form.picType == "01" || this.form.websiteId == 55)
      ) {
        if (this.current == this.main.pictureList.length) {
          if (this.main.pictureList.length == 0 || this.current == this.main.pictureList.length){
            if(this.main.hasNext){
              this.change('Next')
            }
          }
          else {
            return;
            this.Confirmation();
            //2019/4/15 新需求修改，弹框修改成 按钮

            // this.$confirm('确定提交审核?', '提示', {
            // 	confirmButtonText: '提交',
            // 	cancelButtonText: '不提交',
            // 	type: 'warning'
            // })
            // .then(() => {
            // 	reviewCheck(this.main.subjectWebsiteId).then(res => {
            // 		console.log(res)
            // 		if (res.code == 0) {
            // 			this.$message({
            // 				type: 'success',
            // 				message: '提交成功！'
            // 			})
            // 			this.change('Next')
            // 		}
            // 	})
            // }).catch(() => {

            // });
          }
        } else {
        this.current++
        if(this.current == this.main.pictureList.length){
          if(this.source != 1){
            if(this.form.picType == '01'){
              this.show = true
            }else{
              if(this.form.websiteId == '55'){
                this.show = true
              }
            }
          }
        }
        };
      } else {

        if (this.current == this.main.pictureList.length) {
          this.change("Next")
        }
        else {
          this.current++;
          if(this.current == this.main.pictureList.length){
            if(this.source != 1){
              if(this.form.picType == '01'){
                this.show = true
              }else{
                if(this.form.websiteId == '55'){
                  this.show = true
                }
              }
            }
          }
        }
      }
    },
    //2019/4/15 新需求修改，弹框修改成 按钮
    Confirmation() {
      reviewCheck(this.main.subjectWebsiteId).then(res => {
        console.log(res, 'Confirmation');
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "提交成功！"
          });
          if(this.main.hasNext){
            this.change("Next");
          }else{
            let route = this.$route
            let parmentPath = route.matched[route.matched.length-2].path
            let projectNo = route.params.projectNo
            
            if(parmentPath.indexOf('calibration') > -1){
              this.$router.push('/netCheck/'+projectNo+'/calibration')
            }
            if(parmentPath.indexOf('auditData') > -1){
              this.$router.push('/netCheck/'+projectNo+'/auditData')
            }
          }
        }
      });
    },
    prev() {
      if(this.imgLoading){
        return false;
      }
      if (this.current > 1) this.current--;
      else this.change("Prev");
    },
    //根据主体序号查图片
    getImgList(index) {
      let options = { source: this.source, data: {}, projectNo: this.projectNo };
      this.loading = false;
      if (this.source == 0) {
        options.data = {
          subjectWebsiteNum: this.main.subjectWebsiteId,
          picType: this.form.picType,
          status: this.form.status,
          subjectName: this.form.subjectName,
          websiteId: this.form.websiteId
        };
      } else {
        options.data = {
          subjectWebsiteNum: this.main.subjectWebsiteId,
          type: this.form.picType
        };
        if (this.isMark && this.form.picType == '01') options.data.flaged = true;
      }
      crawlinfo(options)
        .then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.main = res.result;
            this.imgDataProcessing() //处理图片数据，分离标记的数据和全部数据
            if (this.main.pictureList.length == 0) this.current = 0;
            else {
              this.current = index;
            }
            if(this.current == this.main.pictureList.length){
              if(this.source != 1){
                if(this.form.picType == '01'){
                  this.show = true
                }else{
                  if(this.form.websiteId == '55'){
                    this.show = true
                  }
                }
              }
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    imgDataProcessing(){
      //this.imgData = this.main.pictureList ? JSON.parse(JSON.stringify(this.main.pictureList)) : [] //获取主体全部图片
      let pictureList = JSON.parse(JSON.stringify(this.main.pictureList))
      let markImgData = [];
      if(pictureList.length > 0){
        pictureList.forEach((v,i)=>{
          if(v.isMark === 'Y'){
            markImgData.push(v)
          }
        })
      }
      this.markImgData = markImgData

      let pictureList2 = JSON.parse(JSON.stringify(this.main.pictureList))
      if(pictureList2.length > 0){
        this.imgData = pictureList2
      }else{
        this.imgData = []
      }

      if(this.isMark && this.form.picType == '01'){ //当前状态为预览标记的图片
        this.main.pictureList = this.markImgData
      }else{ //预览全部图片
        this.main.pictureList = this.imgData
      }
    },
    //删除图片
    deleteImg() {
      this.$confirm("确定删除该图片？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletePic({
            picId: this.main.pictureList[this.current - 1].picId,
            picType: this.form.picType,
            subjectWebsiteNum: this.main.subjectWebsiteId
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              // if (this.current == 1 && this.main.pictureList.length > 1) {
              //   this.main.pictureList.splice(0, 1);
              // } else {
              //   this.current--;
              //   this.main.pictureList.splice(this.current, 1);
              // }
              if(this.current == this.main.pictureList.length){
                this.current--;
                this.main.pictureList.pop()
              }else{
                this.main.pictureList.splice(this.current - 1, 1);
              }
              if(this.current != 0){
                this.visibleImg = this.main.pictureList[this.current-1].url
              }
            }
          });
        })
        .catch(() => {});
    },
    //重新爬取
    reCrawl() {
      if(this.main.hasNext){
        let option = {
          projectId: this.projectNo,
          subjectWebsiteNum : this.main.subjectWebsiteId
        }
        
        this.change('Next', {type:'reCrawl', option: option})
        return
        

        // cancelReview(subjectWebsiteId).then(res => {
        //   if(res.code==0){
        //     this.cancelReview = false
        //   }
        // }).catch(() => {
        //   this.cancelReview = false
        // });
      }else{
        //calibration(校验资料) auditData(审核资料)
        let route = this.$route
        let parmentPath = route.matched[route.matched.length-2].path
        let projectNo = route.params.projectNo
        
        recollect({
          projectId: this.projectNo,
          subjectWebsiteNum: this.main.subjectWebsiteId
        }).then(res => {
          if(res.code == 0){
            // this.$message({
            //   type: "success",
            //   message: "已经重新爬取数据"
            // });
            if(parmentPath.indexOf('calibration') > -1){
              this.$router.push('/netCheck/'+projectNo+'/calibration')
            }
            if(parmentPath.indexOf('auditData') > -1){
              this.$router.push('/netCheck/'+projectNo+'/auditData')
            }
          }
        })
      }
    },
    //补充上传
    fillUpload(res, name) {
      let options = {
        fileName: name,
        filePath: res,
        picType: this.form.picType,
        subjectWebsiteNum: this.main.subjectWebsiteId
      };
      upload(options).then(res => {
        if (res.code == 0) {
          this.getImgList(this.main.pictureList.length + 1);
        }
      });
    },
    //删除并重传   2019/4/15 新需求修改，给删除并重传去掉
    reUpload(res, name) {
      // let options = {
      // 	fileName: name,
      // 	filePath: res,
      // 	picType: this.form.picType,
      // 	subjectWebsiteNum: this.main.subjectWebsiteId,
      // 	picId: this.main.pictureList[this.current - 1].picId
      // }
      // if (this.form.picType == '01') options.listPicId = this.main.pictureList[this.current - 1].resultDetailListId
      // delandupload(options).then(res => {
      // 	if (res.code == 0) {
      // 		this.getImgList(this.current)
      // 	}
      // })
    },
    //审批不合格
    unpass() {
      // this.$prompt('', '不合格的原因', {
      // 	confirmButtonText: '确定',
      // 	cancelButtonText: '取消',
      // 	inputType:'textarea',
      // 	inputMaxlength:100
      // }).then(({ value }) => {
      // 	let options={
      // 		remark:value,
      // 		subjectWebsiteNum:this.main.subjectWebsiteId
      // 	}
      // 	reviewFailure(options).then(res=>{
      // 		if(res.code==0){
      // 			this.$message({
      // 				type:'success',
      // 				message:'审批成功！'
      // 			})
      // 		}
      // 	})
      // }).catch(() => {
      // });
      // <div class="el-textarea el-input--small"><textarea autocomplete="off" placeholder="" class="el-textarea__inner" style="min-height: 31px;"></textarea></div>
      const h = this.$createElement;
      this.$msgbox({
        title: "不合格的原因",
        message: h("div", { class: "el-textarea el-input--small" }, [
          h("textarea", {
            class: "el-textarea__inner",
            attrs: {
              rows: "4",
              maxlength: "100"
            },
            domProps: {
              value: this.value
            },
            on: {
              input: event => {
                this.reason = event.target.value;
              }
            }
          })
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            let options = {
              remark: this.reason,
              subjectWebsiteNum: this.main.subjectWebsiteId
            };
            if(this.main.hasNext){ //当点击不合格操作时，如果有下一主体，先跳到下一主体然后处理不合格操作
              this.change('Next', {type: 'unpass', option: options})
              
            }else{
              //calibration(校验资料) auditData(审核资料)
              let route = this.$route
              let parmentPath = route.matched[route.matched.length-2].path
              let projectNo = route.params.projectNo
              
              let options = {
                remark: this.reason,
                subjectWebsiteNum: this.main.subjectWebsiteId
              };
              reviewFailure(options).then(res => {
                if (res.code == 0) {
                  if(parmentPath.indexOf('calibration') > -1){
                    this.$router.push('/netCheck/'+projectNo+'/calibration')
                  }
                  if(parmentPath.indexOf('auditData') > -1){
                    this.$router.push('/netCheck/'+projectNo+'/auditData')
                  }
                }
              });
            }
            done();
          } else {
            done();
          }
        }
      })
        .then(action => {})
        .catch(() => {});
    },
    //查看表格
    viewExcel() {
      // previewFile(this.main.excelFilePath);
        //var title = this.main.excelFileName.splice('.')
        previewFile(this.main.excelFilePath);
    }
  },
  mounted() {
    this.status = this.$route.query.status;
    let self = this;
    this.getImgList(1);
    let body = document.body;
    body.onkeyup=function(event){
      event.preventDefault();
        let tagName = event.target.tagName,
          code = event.code;
        //console.log('ddfdfdf', typeof tagName)
        if (tagName != "TEXTAREA") {
          //不是标记文本框
          if(self.imgLoading){
            return false;
          }
          console.log(code);
          switch (code) {
            case 'ArrowUp':
              if(self.main.hasPrev){
                self.change('Prev')
              }else{
                if(self.isMessageBox) return;
                  self.isMessageBox = true;
                  MessageBox.alert('没有可查看的主体','提示',{
                    type:'warning',
                    confirmButtonText: '确定',
                    callback: () => {
                      self.isMessageBox = false
                    }
                  })
              }
              break;
            case 'ArrowDown':
              if(self.main.hasNext){
                self.change('Next')
              }else{
                if(self.isMessageBox) return;
                  self.isMessageBox = true;
                  MessageBox.alert('没有可查看的主体','提示',{
                    type:'warning',
                    confirmButtonText: '确定',
                    callback: () => {
                      self.isMessageBox = false
                    }
                  })
              }
              break;
            case 'ArrowLeft':
              if(self.current > 1){
                self.current--
              }else{
                if(self.main.hasPrev){
                  self.change('Prev')
                }else{
                  if(self.isMessageBox) return;
                  self.isMessageBox = true;
                  MessageBox.alert('没有可查看的主体','提示',{
                    type:'warning',
                    confirmButtonText: '确定',
                    callback: () => {
                      self.isMessageBox = false
                    }
                  })
                }
              }
              break;
            case 'ArrowRight':
              // if(self.current == 0){
              // }else{
                if(self.current < self.main.pictureList.length){
                  self.current++
                  if(self.current == self.main.pictureList.length){
                    if(self.source != 1){
                      if(self.form.picType == '01'){
                        self.show = true
                      }else{
                        if(self.form.websiteId == '55'){
                          self.show = true
                        }
                      }
                    }
                  }
                  return
                }
                if(self.current == self.main.pictureList.length){
                  if(self.main.hasNext){
                    self.change('Next')
                  }else{
                    if(self.isMessageBox) return;
                    self.isMessageBox = true;
                    MessageBox.alert('没有可查看的主体','提示',{
                      type:'warning',
                      confirmButtonText: '确定',
                      callback: () => {
                        self.isMessageBox = false
                      }
                    })
                  }
                }
              //}
              break;
            default:
              return false;
          }
        }
    }
    // body.addEventListener(
    //   "keyup",
    //   function(event) {

    //   },
    //   false
    // );
  },
  created() {
    if (this.$route.path.indexOf("calibration") > -1) { //校验资料页面
      this.source = 0;
      this.expand = true;
    } else if(this.$route.path.indexOf("relatedManuscript") > -1){ //关联底稿
      this.source = 0;
      this.expand = true;
      this.relatedManuscript = true;
    }else{
      this.source = 1;
      this.expand = false;
      this.isMark = this.$route.query.status == 0 ? false : true;
    }
    this.main.subjectWebsiteId = this.$route.params.id;
    this.form = this.$route.query;
    this.projectNo = this.$route.params.projectNo;
  },
  beforeDestroy(){
    document.body.onkeyup = null
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.leftBox {
  .topBox {
    .el-checkbox {
      margin-top: 14px;

      .el-checkbox__label {
        font-size: 12px;
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";
@import "@/assets/css/viewImage.scss";
</style>
