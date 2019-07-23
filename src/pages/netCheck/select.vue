<template>
  <div class="box bg">
    <div class="title">选取案件</div>
    <div class="error">
      <div class="icon">
        <i class="el-icon-warning"></i>
      </div>
      <div class="txt">先选取对应的案件后，才能进入网络核查页面！</div>
    </div>
    <el-form class="form" ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="案件编号" prop="projectNo">
        <el-autocomplete
          style="width: 300px"
          class="inline-input"
          v-model="form.projectNo"
          :fetch-suggestions="querySearch1"
          :trigger-on-focus="false"
          @select="noChange"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="案件名称" prop="projectName">
        <el-autocomplete
          style="width: 300px"
          class="inline-input"
          v-model="form.projectName"
          :fetch-suggestions="querySearch2"
          :trigger-on-focus="false"
          @select="nameChange"
        ></el-autocomplete>
      </el-form-item>
    </el-form>
    <div style="display: inline-block;text-align: center;width: 100%;margin-top:12px;">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button @click="resetForm"  style="background: #e34d3b;color: #fff;">重置</el-button>
    </div>
  </div>
</template>
<script>
import { submission, project } from "@/api/project";
export default {
  data() {
	  const validateprojectName = (rule, value, callback) => {
			if (value.trim().length == 0) {
				callback(new Error('请输入项目名称'))
			} else {
				callback()
			}
		}
	const validateprojectNo = (rule, value, callback) => {
      if (value.length < 0 || value.length > 20) {
        callback(new Error('请输入编号0-20位以内'))
      } else {
        callback()
      }
    }
    return {
      form: {
        projectNo: "",
        projectName: ""
      },
    list: [],
    lists:[],
	  rules:{
				projectNo: [{ required: true, trigger: 'blur', validator: validateprojectNo}],
				projectName: [{ required: true, trigger: 'blur', validator: validateprojectName }]
	  }
    };
  },
  mounted() {
	
  },
  methods: {
    noChange(value){
      this.form.projectName = value.projectName
    },
    nameChange(value){
      this.form.projectNo = value.projectNo
    },
    querySearch1(queryString, cb) {
      	let VM=this
      project(this.form.projectNo, "")
        .then(res => {
      //console.log(res)
       VM.lists = res.result;
			  for(let i = 0; i < VM.lists.length; i++){
				  VM.lists[i].value = VM.lists[i].projectNo
			  }
		var results = queryString ? VM.lists.filter(VM.createStateFilter(queryString)) : VM.lists;
        cb(results);
        localStorage.projectNo = res.result[0].projectNo; //给编号存起来
        //this.form.projectName= localStorage.projectName
		})
    .catch(error => {});
    },
    querySearch2(queryString, cb) {
		let VM=this
      project("", this.form.projectName)
        .then(res => {
			//console.log(res)
		//	console.log('data----',res.result)
			  VM.list = res.result;
			  for(let i = 0; i < VM.list.length; i++){
				  VM.list[i].value = VM.list[i].projectName
			  }
		var results = queryString ? VM.list.filter(VM.createStateFilter(queryString)) : VM.list;
        cb(results);
        localStorage.projectName = res.result[0].projectName;
        //this.form.projectNo= localStorage.projectNo
		})
		.catch(error => {});
	},
	createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
	submit() {
    this.$refs['form'].validate((valid) => {
          if (valid) {
            // alert(this.form.projectNo)
            // return;
        submission(this.form.projectNo, this.form.projectName)
					.then(res => {
            //console.log(res)
                if (res.code != 0) {
                    this.$message({
                      message: msg,
                      type: 'error'
                    });
                } else {
                      this.$router.push({ path: `/netCheck/${this.form.projectNo}/createMenu` });
                }
             
					})
					.catch(error => {
            
          });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
				
		},
    resetForm() {
      this.form = {
        projectNo: "",
        projectName: ""
      };
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/assets/css/varibles.scss";

.box {
  width: 410px;
  position: absolute;
  height: 280px;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -210px;

  .title {
    color: #4b4b4b;
    font-size: 16px;
    line-height: 48px;
    position: relative;
    font-weight: 600;
    padding-left: 33px;
    background: #ecf1f4;

    &::before {
      content: "";
      width: 4px;
      height: 16px;
      background-color: $global-color;
      margin-right: 8px;
      position: absolute;
      top: 16px;
      left: 20px;
    }
  }

  .error {
    border: 1px solid $danger-color;
    width: 380px;
    margin: 5px auto 0;

    .icon {
      background: $danger-color;
      width: 50px;
      text-align: center;
      float: left;

      i {
        color: #fff;
        font-size: 28px;
        line-height: 43px;
      }
    }

    .txt {
      text-align: center;
      color: $danger-color;
      line-height: 43px;
      width: 330px;
      font-size: 14px;
      margin-left: 50px;
    }
  }
}

.form {
  width: 380px;
  margin: 22px auto 0;
}
</style>