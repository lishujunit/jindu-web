 <template>
  <div class="confirmAnsweringContact">
    <el-row>
      <tableContent :tableData="tableData" v-loading="loading" :tableSelectionBool="tableSelectionBool" :needColNum="8">
        <!-- 附件 -->
        <template v-slot:appendix>
            <el-table-column align="center" label="附件" min-width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.attachmentArr.length>0">
                <div v-for="(item,index) in scope.row.attachmentArr" :key="index">
                  <span :data-id="item.id">{{item.name}}</span>
                </div>
              </template>
              <template v-else>
                <span>无附件</span>
              </template>
            </template>
          </el-table-column>
        </template>
        <!-- 尾部 -->
        <template v-slot:tailing>
          <el-table-column align="center" prop="state" width="200" label="应答部门" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-input v-if="isShowOperating" v-model="scope.row.department" placeholder="请填写" maxlength="20"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="应答联系人" prop="id" min-width="130">
            <template slot-scope="scope">
              <el-input v-if="isShowOperating" v-model="scope.row.departmentHead" placeholder="请填写姓名" maxlength="20"></el-input>   
            </template>
          </el-table-column>
          <el-table-column align="center" label="应答联系人手机号" prop="id" min-width="130">
            <template slot-scope="scope">
              <el-input v-if="isShowOperating" v-model="scope.row.contactPhone" @keyup.native="handleClick(scope.$index)" maxlength="13" placeholder="请填写电话号码"></el-input>   
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" prop="id" min-width="80">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.department&&scope.row.departmentHead&&scope.row.contactPhone&&isShowOperating" @click="clientUser(scope.row.id,scope.$index)">提交</el-button>
            </template>
          </el-table-column>
        </template>
      </tableContent>
    </el-row>
  </div>
</template>

<script>
import tableContent from '../components/tableContent'
import {mapActions,mapState} from 'vuex'
import {
  getTableDataAnswering,
  submitContact
} from "@/api/dueDiligence";
import {validatePhone,checkPhone} from "@/utils/validate"
export default {
  name: "confirmAnsweringContact",
  components: {
    tableContent
  },
  data() {
    return {
      tableData: [],//表格数据
      loading:true,//是否渲染
      tableSelectionBool:false,//表格多选框是否熟宣
      inputCompany:'',//输入的公司，没用上，因为放进表格数据里了
      inputName:'',//输入的名字，没用上，因为放进表格数据里了
      workUnitId:'',//工作单元id
      companyAboutId: '',//选中的公司ID
      num:'',
      matterStatus: this.$route.query.status,
    };
  },
  computed: {
    isShowOperating(){
      let status = true;
      // console.log(this.matterStatus)
      if(this.matterStatus == 3){ //事项已完成
        status = false;
      }
      return status;
    },
  },
  methods: {
    handleClick(index){
      if(isNaN(this.tableData[index].contactPhone)&&this.tableData[index].contactPhone){
        this.tableData[index].contactPhone = this.tableData[index].contactPhone.replace(/[^0-9|-]/g, '');
      }
    },
    //提交
    clientUser(val,index){
      this.$confirm('是否继续提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.tableData.forEach(item=>{
            if(item.id===val){
              let thisId=item.id
              let dept=item.department
              let respondName=item.departmentHead
              let respondPhone=item.contactPhone
              if(validatePhone(respondPhone)||checkPhone(respondPhone)){
                if(thisId&&dept&&respondName&&respondPhone){
                  console.log(thisId,dept,respondName,respondPhone);
                  submitContact(thisId,dept,respondName,respondPhone).then(res=>{
                    if(res.code===0){
                      // this.initAllData()
                      this.tableData.splice(index,1)
                      this.$message.success('提交成功');
                    }else{
                      this.initAllData()
                    }
                  })
                }else{
                  this.$message.info('已取消提交');
                }
              }else{
                this.$message.error('电话号码输入有误');
              }
            }
          })
        }).catch(()=>{
          this.$message.info('已取消提交');
        })
      
    },
    //表格初始化
    initAllData() {
      //需要获取改人员的公司ID   
      getTableDataAnswering(this.companyAboutId,this.workUnitId).then(res => {
        console.log(res);
        if (res.code === 0) {
          let dataArr = res.result;
          if(dataArr){
            dataArr.forEach(item=>{
              item.inforMation = item.inforMation.replace(/\,/g, "\n");
              if (item.attachment) {
                let contentArr = [];
                item.attachment = item.attachment.split(",");
                for (let i = 0;i<item.attachment.length;i++) {
                  if (item.attachment[i]) {
                    let content = {};
                    content.id = item.attachment[i];
                    content.name = item.attachment[i + 1];
                    contentArr.push(content);
                    i += 1;
                  }
                }
                item.attachmentArr = contentArr;
              } else {
                item.attachmentArr = [];
              }
            })
            for(let i=0;i<dataArr.length;i++){
              if(dataArr[i].attribute%1==0&&i!=dataArr.length-1){
                if(dataArr[i+1].attribute.split('.')[0]!=dataArr[i].attribute){
                  // console.log(dataArr[i])
                  dataArr.splice(i,1)
                  i--
                }
              }else if(dataArr[i].attribute%1==0&&i==dataArr.length-1){
                dataArr.splice(i,1)
                i--
              }
            }
          }else{
            dataArr =[]
          }
          console.log(dataArr);
          this.tableData = dataArr;
          this.loading = false
        }
      });
    },
    ...mapActions('dueDiligence',['setLoginStatus','setAttachmentName'])
  },
  created() {
    if(this.$route.params.id){
      this.workUnitId = this.$route.params.id
    }else if(this.$route.query.id){
      this.workUnitId = this.$route.query.id
    }else{
      this.$router.go(-1)
    }
    if(this.$route.query.companyId){
      this.companyAboutId = this.$route.query.companyId
    }
    this.initAllData()
  },
   mounted() {
    this.setLoginStatus(true);
    this.setAttachmentName('项目名称:'+this.$route.query.projectName)
  },
  beforeDestroy() {
    this.setLoginStatus(false)
  }, 

};
</script>
<style lang='scss' scoped>
</style>