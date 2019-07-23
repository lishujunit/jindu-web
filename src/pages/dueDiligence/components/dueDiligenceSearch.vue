<template>
  <div class="dueDiligenceSearch">
    <el-row style="margin:10px 0;background-color:#fff;box-sizing: border-box;padding:20px;">
      <el-row style="margin:10px 0 20px;">
        <el-col :span="8">
          <span style="padding-right:2%">原始资料名称</span>
          <el-autocomplete placeholder="请输入内容" clearable v-model="operations.startFileName" style="width:50%" :fetch-suggestions="querySearchOldFileName" @select="searchIt" @clear="searchIt"></el-autocomplete>
        </el-col>
        <el-col :span="8">
          <span style="padding-right:2%">解压文件名称</span>
          <el-autocomplete placeholder="请输入内容" clearable v-model="operations.unzipFilesName" style="width:50%" :fetch-suggestions="querySearchFileName" @select="searchIt" @clear="searchIt"></el-autocomplete>
        </el-col>
        <el-col :span="8">
          <span style="padding-right:2%">上传时间</span>
          <el-date-picker class="date" type="date" v-model="operations.beginTime" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="searchIt" style="width:37%"></el-date-picker>
          <span style="padding:0 2%">至</span>
          <el-date-picker class="date" type="date"  v-model="operations.endTime" value-format="yyyy-MM-dd" :picker-options="endDatePicker" @change="searchIt" style="width:37%"></el-date-picker>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start">
        <el-col :span="19" v-if="propertyBool">
          <span style="padding-right:1.5%">尽调清单属性</span>
          <el-autocomplete placeholder="请输入内容" clearable v-model="operations.dueDiligenceProperty" :fetch-suggestions="querySearchDueDiligence" style="width:20%" @select="searchIt"  @clear="searchIt"></el-autocomplete>
        </el-col>
        <el-col :span="19" v-else>
          <slot name="otherSearch"></slot>
        </el-col>
        <el-col :span="5">
          <el-row type="flex" justify="center">
            <el-button style="margin-right:30px;" type="primary" @click="searchIt">搜索</el-button>
            <el-button type="danger" @click="removeIt">重置</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import {
  getSelectFileData,//尽调属性
} from "@/api/dueDiligence"
import{mapState,mapActions} from 'vuex'

export default {
  name: "dueDiligenceSearch",
  components: {},
  props:{
    operations:{type:Object,default(){
      return {
        startFileName: "", //原始资料名称
        unzipFilesName: "", //解压文件名
        beginTime: "", //上传开始时间
        endTime: "", //上传结束时间
        dueDiligenceProperty: "",//尽调清单属性
      }
    }},
    fileNames:{type:Array,default(){return []}},//所有文件名称
    oldFileNames:{type:Array,default(){return []}},//所有原始资料文件名称
    propertyBool:{type:Boolean,default:true},//所有原始资料文件名称
    dueDiligencePropertiesArr:{type:Array,default(){return []}},//所有原始资料文件名称
  },
  data() {
    return {
      startDatePicker: {
        disabledDate: (time) => {
          if (this.operations.endTime) {
            return time.getTime() >  new Date(this.operations.endTime).getTime();
          }
        },
      },
      endDatePicker: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.operations.beginTime).getTime()- 1*24*60*60*1000;//减去一天的时间代表可以选择同一天;
        },
      },
      dueDiligenceProperties:[],//尽调清单属性
    };
  },
  computed: {
			...mapState('dueDiligence', ['companyAboutData'])
  },
  watch:{
    companyAboutData:function(){
      // this.allgetSelectFileData()
    }
  },
  methods: {
    //搜索
    searchIt() {
      this.$emit('searchContent')
    },
    //重置(weiwancheng)
    removeIt() {
      this.$emit('resetSearch')
    },
    //尽调搜索筛选
    querySearchDueDiligence(queryString, cb) {
      console.log(this.dueDiligencePropertiesArr)
      var papePropertiesArr = [...this.dueDiligencePropertiesArr]
      var results = queryString ? papePropertiesArr.filter(val=>val.value.indexOf(queryString) === 0) : papePropertiesArr;
      cb(results);
    },
    //所有解压文件名筛选
    querySearchFileName(queryString, cb) {
      var fileNamesArr = [...this.fileNames]
      var results = queryString ? fileNamesArr.filter(val=>val.value.indexOf(queryString) === 0) : fileNamesArr;
      cb(results);
    },
    //所有原始资料文件名筛选
    querySearchOldFileName(queryString, cb) {
      var fileNamesArr = [...this.oldFileNames]
      var results = queryString ? fileNamesArr.filter(val=>val.value.indexOf(queryString) === 0) : fileNamesArr;
      cb(results);
    },
  },
  created() {
    if(this.$route.params.id){
      this.workUnitId = this.$route.params.id
    }else if(this.$route.query.id){
      this.workUnitId = this.$route.query.id
    }else{
      this.$router.go(-1)
    }
  }
};
</script>
