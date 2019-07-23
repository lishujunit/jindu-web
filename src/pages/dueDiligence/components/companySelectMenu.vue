<template>
  <div class="companySelectMenu">
    <el-select v-model="value" placeholder="请选择" style="margin-bottom:20px;width:340px;" @change="addData" popper-class="popperName" :filterable="true" :filter-method="changeContent" @focus="initData">
      <el-option v-for="item in company" :key="item.id" :label="item.companyName" :value="item.id" style="padding:0;">
        <div class="box1">
          <span>{{ item.companyName }}</span>
          <span style="color: #8492a6; font-size: 13px" @click.stop="delSelect(item.id)" class="hidden" v-if="operationDelBtn&&isShowOperating">X</span>
        </div>
      </el-option>
      <div v-if="operationAddBtn&&adddBool&&isShowOperating" class="addBtn" @click="addCompany">
        <span>+ 添加</span>
      </div>
    </el-select>
    <inputDialog :options="options1"></inputDialog>
  </div>
</template>

<script>
import inputDialog from "../components/inputDialog";
import{mapState} from 'vuex'
export default {
  name: "companySelectMenu",//选择公司的下拉菜单
  components: {
    inputDialog
  },
  props: {
    selectData: {
      type: Array,
      default() {return [];}
    },//表格下拉数据
    operationAddBtn:{
      type:Boolean,
      default:true
    },//是否能增加公司
    operationDelBtn:{
      type:Boolean,
      default:true
    },//是否能删除公司
    addCompanyAbout:{
      type: Object,
      default() {return {id:'',companyName:''};}
    },//增加的公司的相关信息
  },
  data() {
    return {
      company: [],//公司下拉框的数组集合
      allCompany: [],//公司下拉框的所有数组集合
      show: "",//显示的值 目前未用
      value: "",//当前选项的值
      lastValue: "",//最后一次的选项值
      adddBool:true,//增加按钮是否存在
      repeat:false,//公司名称是否重复
      options1:{
          dialogFormVisible:false,
          handleClose:this.handleClose,
          reasonInput:'',
          moreShow:false,
          title:'请输入公司名称',
          handleCommit:this.handleCommit,
      },//公共组件弹框的参数(添加附件)
      matterStatus: this.$route.query.status,
    };
  },
  computed: {
    isShowOperating(){
      let status = true;
      if(this.matterStatus == 2){ //事项已完成
        status = false;
      }
      return status;
    },
    ...mapState('dueDiligence', ['companyAboutData'])
  },
  watch: {
    selectData: function(val, oldval) {
      if(this.operationAddBtn&&this.isShowOperating){
        this.company =[{id:'no',companyName:'无数据'}]
      }
      this.company = val.concat(this.company);
      this.allCompany = JSON.parse(JSON.stringify(this.company))
      if(this.company.length>0){
        if(this.company[0].id==='no'){
          this.value =''
          this.lastValue=""
        }else{
          if(!this.companyAboutData.id){
            this.lastValue? (this.value = this.lastValue) : ((this.value = this.company[0].id),(this.lastValue = this.company[0].id));
          }else{
            this.lastValue? (this.value = this.lastValue) : ((this.value = this.companyAboutData.id),(this.lastValue = this.companyAboutData.id));
          }
        }
        // console.log(this.value,this.lastValue);
      }
    },
    addCompanyAbout:function(val,oldval){
      this.company.splice(-1,0,val)
      this.allCompany.splice(-1,0,val)
      this.lastValue = val.id
      this.value = val.id
    },
  },
  methods: {
    //模糊查询输入值
    changeContent(val){
      // console.log(val);
      if(this.company.length<this.allCompany.length){
        this.initData()
      }
      if(val){
        let inputArr = []
        for(let i=0;i<this.company.length;i++){
          if(this.company[i].companyName.indexOf(val)>-1){
            inputArr = [...this.company.splice(i,1)]
            this.adddBool=false
          }
        }
        this.company = []
        this.company =[...inputArr] 
        // inputArr.concat(this.company);
      }else{
         this.company = JSON.parse(JSON.stringify(this.allCompany))
         this.adddBool=true
      }
    },
    //删除
    delSelect(val) {
      this.$confirm("此操作将永久删除该公司及其清单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除自身的判断
          if (val === this.company[0].id &&val === this.value &&this.company[1].id === "no") {
            //唯一数据的情况
            this.value = "";
            this.lastValue = "";
            this.$emit("checkData", []);
          } else if (val === this.value) {
            for(let i=0;i<this.company.length;i++){
              if(this.company[i].id===val){
                if(Number(i)+1!==this.company.length){
                  if(this.company[Number(i)+1].id!== "no"){
                      //不是最后一条且后一条不是no的时候
                      this.value = this.company[Number(i)+1].id;
                      this.lastValue = this.value;
                      this.$emit("checkData", [this.company[Number(i)+1]]);
                      console.log(this.company[Number(i)+1].companyName);
                  }else{
                    //不是最后一条且后一条是no的时候
                      this.value = this.company[0].id;
                      this.lastValue = this.value;
                      this.$emit("checkData", [this.company[0]]);
                      console.log(this.company[0].companyName);
                  }
                }else{
                  //是最后一位时
                  this.value = this.company[0].id;
                  this.lastValue = this.value;
                  this.$emit("checkData", [this.company[0]]);
                  console.log(this.company[0].companyName);
                }
              }
            }
          }
          this.$emit("changeSelectData", val, false);
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    //增加
    addCompany(){
      this.options1.dialogFormVisible = true
      this.options1.reasonInput = ''
    },
    //添加公司的弹框点击确认后
    handleCommit(){
      this.company.forEach(item=>{
        if (item.companyName === this.options1.reasonInput) {
          this.repeat = true
        }
      })
      if(this.repeat){
        this.$message.warning('输入了重复的公司名称')
        this.repeat = false
      }else{
        if (this.options1.reasonInput == ''){
          this.$message.warning('输入不能为空！')
        }else{
          this.$emit("changeSelectData", this.options1.reasonInput, true)
          this.options1.dialogFormVisible = false
          this.options1.reasonInput = ''
        }
      }
      
    },
    //添加公司的弹框点击取消后
    handleClose(){
      this.options1.dialogFormVisible = false
      this.options1.reasonInput = ''
    },
    //选中
    addData(val) {
      // console.log(val);
      if(this.company.length<this.allCompany.length){
        this.initData()
      }
      if(val!=='no'){
        this.lastValue = val;
        let selectDataArr = [];
        let selectData = this.company.find(item => val === item.id);
        selectDataArr.push(selectData);
        this.$emit("checkData", selectDataArr);
      }else{
        this.value =this.lastValue
      }
    },
    //初始化数据
    initData(){
      this.company = []
      this.company = JSON.parse(JSON.stringify(this.allCompany))
      this.adddBool=true
    }
  },
  created() {
    if (this.selectData.length > 0) {
      if(this.operationAddBtn&&this.isShowOperating){
        this.company =[{id:'no',companyName:'无数据'}]
      }
      this.company = this.selectData.concat(this.company);
      this.allCompany = JSON.parse(JSON.stringify(this.company))
      console.log(this.company)
      if(this.company[0].id==='no'){
        this.value =''
        this.lastValue=""
      }else{
        this.lastValue? (this.value = this.lastValue) : ((this.value = this.company[0].id),(this.lastValue = this.company[0].id));
      }
      // console.log(this.value,this.lastValue);
    }else{
      if(this.operationAddBtn&&this.isShowOperating){
        this.company =[{id:'no',companyName:'无数据'}]
      }
      this.allCompany = JSON.parse(JSON.stringify(this.company))
      this.value =''
      this.lastValue=""
    }
  }
};
</script>
<style lang='scss' scoped>
.box1 {
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  .hidden {
    opacity: 0;
  }
}
.box1:hover .hidden {
  opacity: 1;
}
.addBtn {
  width: 100%;
  height: 40px;
  line-height:40px;
  box-sizing: border-box;
  color: #66b1ff;
  border: 1px solid #66b1ff;
  background-color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0px;
  left:0px;
  z-index: 10000;
  cursor: pointer;
}
</style>