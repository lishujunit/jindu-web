<template>
	<div class="boxItem shadow matter">
		<div class="allTitle">事项
				<div class="add" @click="addItems" v-if="status!=0 && status!=1 && status!=3 && userAuth.indexOf('Partnership')>-1|| userAuth.indexOf('Resp')>-1">
						 <i class="el-icon-plus" ></i>
				</div>
				<el-button class="fr" type="primary" @click="editMatter" :loading="info.editLoad&&info.edit"
					v-if="status!=0 && status!=1 && status!=3 && userAuth.indexOf('Partnership')>-1|| userAuth.indexOf('Resp')>-1">
				 {{info.edit?'保存准备事项':'修改准备事项'}}
				<!-- 保存准备事项 -->
				</el-button>
		</div>
		<mat-ters v-show="isShow"  :addMatTers="addMatTers" :matterIndex="matterIndex" :PisShow='isShow' @newMatter="newMatter" v-if="status==2" :listnuber='list' 
		:status="info.status"></mat-ters>

		<template v-if="status<=1|| (status==2 && edit)">
			<template v-if="workunit.length>0">
				<div v-for="item,index in list" class="inputList">
					<div class="top">
						<div class="name fl">
							<span>事项名称：</span>
									<!-- <span>事项{{index+1}}：</span> -->
							<el-input size="mini" type="text" v-model="item.desc" placeholder="请输入事项名称" :maxlength="20"></el-input>
							<!-- <el-input size="mini" :disabled="!item.add" type="text" v-model="item.desc" placeholder="请输入事项名称" :maxlength="20"></el-input> -->
						</div>
						<div class="add delete" v-if="list.length>1&&item.add" @click="deleteItem(item.matterNo,index)">
							<i class="el-icon-close"></i>
						</div>
						<div class="add" @click="addItem(index)" v-if="status!=2">
							<!-- <div class="add" @click="addItem(index)" v-if="list.length>1&&item.add"> -->
							<i class="el-icon-plus"></i>
						</div>
					</div>
					<div class="unit">
						<el-checkbox-group v-model="item.workunitList">
							<el-checkbox :disabled="workUnitsSelected[index].indexOf(unit.workUnitNo) > -1"
								:label="unit.workUnitNo"
								v-for="unit in workunit"
								:class="{'custom':unit.workUnitNo=='9'}"
								@change="selectUnit(item.workunitList,unit)"
							 >{{unit.workUnitName}}</el-checkbox>
							<el-form class="demo-ruleForm" style="display: inline-block;" ref='item'>
										<el-form-item label="" prop="custom">
											<el-input v-model="item.custom" size="mini" v-if="item.workunitList.indexOf('9')>-1" :maxlength="20"></el-input>
										</el-form-item>
									</el-form>
						</el-checkbox-group>
					</div>
				</div>
			</template>
		</template>

		<div class="list" v-else>
			<ul>
				<li v-for="item,index in list">
					<div class="item">
						<div class="name fl">事项名称：{{item.desc}}</div>
							<!-- <div class="name fl">事项{{1+index}}：{{item.desc}}</div> -->
						<div class="var under fl" @click="vive(item)">查看报告底稿</div>
						<div class="status" v-if="item.status==2">已完成</div>
						<div class="fr" @click="expand_change(item)">{{item.expand ?'收起&nbsp;&nbsp;&lt;':'展开&nbsp;&nbsp;&gt;'}}</div>
					</div>
					<div class="unit" v-if="item.expand">
						<template v-for="unit in item.workunitList">
							<router-link v-if="unit.workunitNo==6" :to="{path: role ? '/netCheck/'+unit.id + '/auditData' : '/netCheck/'+unit.id, query: { projectNoDefault:projectNo, workunitId: unit.id, from: 'details', matterStatus: item.status }}" class="item">{{unit.workunitName}}</router-link>    <!-- 网络核查 -->
							<router-link v-if="unit.workunitNo==7" :to="{ path: role ? '/complianceCertification/confirmPlans/'+ unit.id:'/complianceCertification/createPlans/'+ unit.id,query:{projectNo:projectNo,status: item.status,from:'details'}}" class="item">{{unit.workunitName}}</router-link>  <!-- 合规证明 -->
							<router-link v-if="unit.workunitNo==8" :to="{ path: role ? '/workUnitInquiry/unitConfirm/'+ unit.id:'/workUnitInquiry/unitCreate/'+ unit.id,query:{projectNo:projectNo,status: item.status,from:'details'}}" class="item">{{unit.workunitName}}</router-link>  <!-- 询证 -->
							<router-link v-if="unit.workunitNo==1" :to="{ path: role ? '/inspectionPlan/checkPlan/'+ unit.id:'/inspectionPlan/inspectionCreate/'+ unit.id,query:{projectNo:projectNo,status: item.status,from:'details'}}" class="item">{{unit.workunitName}}</router-link><!-- 查验计划编制与实施 -->
							<router-link v-if="unit.workunitNo==2" :to="{ path:'/dueDiligence/createRepertoire/'+unit.id,query: {matterNo:item.matterNo, projectNo: projectNo,status: item.status, from: 'details' }}" class="item">{{unit.workunitName}}</router-link><!-- 尽调文件收集与处理 -->
							<router-link v-if="unit.workunitNo==9" :to="{ path: role ? '/selfDefine/checkFiles/'+ unit.id: '/selfDefine/uploadFiles/'+unit.id,query:{projectNo:projectNo,status: item.status,name:unit.workunitName,from:'details'}}" class="item">{{unit.workunitName}}</router-link>  <!-- 自定义 -->
							<router-link v-if="unit.workunitNo==3" :to="{ path: role ? '/manageInterview/'+unit.id+'/confirmPlan' : '/manageInterview/'+unit.id, query: { projectNo: projectNo, from: 'details', matterStatus: item.status }}" class="item">{{unit.workunitName}}</router-link><!-- 管理层访谈 -->
							<router-link v-if="unit.workunitNo==4" :to="{ path: role ? '/partnersInterview/'+unit.id+'/partnersConfirmPlan' : '/partnersInterview/'+unit.id, query: { projectNo: projectNo, from: 'details', matterStatus: item.status }}" class="item">{{unit.workunitName}}</router-link><!-- 业务伙伴访谈 -->
							<router-link v-if="unit.workunitNo==5" :to="{ path: role ? '/regulatoryInterview/'+unit.id+'/regulatoryConfirmPlan' : '/regulatoryInterview/'+unit.id, query: { projectNo: projectNo, from: 'details', matterStatus: item.status }}" class="item">{{unit.workunitName}}</router-link><!-- 监管部门访谈 -->
							<!-- <div class="item" v-else>{{unit.workunitName}}</div> -->
						</template>
					</div>
				</li>
			</ul>
		</div>

	</div>
</template>
<script>
import matTers  from '../components/matTers'
import { mapState, mapMutations, mapActions } from 'vuex'
import { getMatterInfo } from '@/api/mywork'
import { authApi } from '@/api/finalReport'
export default {
	components: {
		matTers
	},
	props: {
		status: Number,
		projectNo: '',
		edit:Boolean,
		info:Object,
		isAddMatter: Number,
		matterIndex: Number
	},
	computed: {
		role(){
			if(this.userAuth.indexOf('Partnership') > -1 || this.userAuth.indexOf('Resp') > -1){
				return true
			}else{
				return false
			}
		},
		//权限
		userRole() {
				if (this.userAuth.indexOf("Partnership") > -1) {
						//Partnership(大律师)
						return "Partnership";
				}
				if (this.userAuth.indexOf("Resp") > -1) {
						//Resp(负责律师)
						return "Resp";
				}
				if (this.userAuth.indexOf("Exec") > -1) {
						//Exec(执行律师)
						return "Exec";
				}
				if (this.userAuth.indexOf("Client") > -1) {
						//Client(客户)
						return "Client";
				}
		},
    getWorkunitListLen(){
      if(this.status > 0){
        let self = this;
        let list = [];
        let data = [];
        list = this.matterList;
        list.forEach(function(v,index){
          let workunitList = v.workunitList;
          let subData = [];
          workunitList.forEach(function(v2, index2){
            subData.push(v2.workunitNo)
          })
          data.push(subData)
        })
        return data
      }
    },
    workUnitsSelected() {
      // status 0(未开始) 1(准备中)2(进行中)3(已完成)
      let self = this;
      let list = [];
      let data = [];
      let len = this.matterList;
      list = this.list;
      list.forEach(function(v,index){
        let workunitList = v.workunitList;
		let subData = [];
        workunitList.forEach(function(v2, index2){
          if(self.status == 0){
            if(index2 >= 2){ return }
            subData.push(v2)
          }
          if(self.status > 0){
            let len = self.getWorkunitListLen;
            if(len[index]){
              if(len[index].indexOf(v2) > -1){
                subData.push(v2)
              }
            }else{
              if(index2 >= 2){ return }
              subData.push(v2)
            }
          }
        })
        data.push(subData)
      })
      return data
    },
		matterInfo() {
			let matter = []
			let matterList = this.matterList;
			this.list.forEach(v => {
				let item = {
					name: v.desc,
					workUnits: [],
					custom: -1,
				}
				if(v.matterNo) item.matterNo=v.matterNo
				if(v.ids){ //修改
					v.workunitList.forEach((v1, i1) => {
						if (v1 == '9') {
							item.workUnits.push({
								id: v1,
								name: v.custom,
								workunitId:v.ids[i1] ? v.ids[i1] : ''
							})
							item.custom = i1
						} else {
								let w=v.ids[i1] ? v.ids[i1] : '';

							item.workUnits.push({ id: v1, workunitId:w,name:v.custom})
						}
					})
				}else{ //提交
					v.workunitList.forEach((v1, i1) => {
						if (v1 == '9') {
							item.workUnits.push({
								id: v1,
								name: v.custom,
								workunitId: ''
							})
							item.custom = i1
						} else {
							item.workUnits.push({ id: v1, workunitId: '',name:v.custom})
						}
					})
				}
				matter.push(item)
			})
			return matter
		},
		...mapState('myWork', ['workunit', 'matterList'])
	},
	watch:{
		edit(){
			this.init()
		},
		isAddMatter(){
			this.init()
		},
		//默认选中前2个
	// 	workunit(val,oldval){
	// 		this.workunitNo1 = val[0].workUnitNo || '';
	// 		this.workunitNo2 = val[1].workUnitNo || '';
	// 		for(let i=0;i<this.list.length;i++){
	// 			this.list[i].workunitList = [this.workunitNo1,this.workunitNo2]
	// 		}

    // },
    matterList(){
      let list = [];
      let data = [];
      list = this.matterList;
      list.forEach(function(v,index){
        let workunitList = v.workunitList;
        let subData = [];
        workunitList.forEach(function(v2, index2){
          subData.push(v2.workunitNo)
        })
        data.push(subData)
      })
      this.matterListData =  data
    }
	},

	data() {
		return {
			list: [],
			workunitNo1:'',
      		workunitNo2:'',
			matterListData: [],
			isShow:false,
			isRouterAlive: true,
			userAuth:'',
			expand:true,
			addMatTers: 0
		}
	},
	methods: {
		 //跳转底稿页
		 vive(item){
		 	console.log(item)
//				this.$router.push({path:'/finalReport/',query:{projectNo: this.projectNo}})
				this.$router.push({path:'/finalReport/'+this.projectNo,query:{materId: item.matterNo,status:item.status}})
		 },
		//权限
	 	getAuth(){
				let vm = this;
				authApi(this.projectNo).then((res)=>{
					//console.log(res,'res')
						if (res.code == 0){
								vm.userAuth = res.result;
						}
				})
    	},
		newMatter(matter, index){
			this.$emit('addMatter',matter, index)
		},
		expand_change(item){
			item.expand=!item.expand
		},
		//修改准备事项
		editMatter(){
			this.btnShow=!this.btnShow
			this.$emit('editMatter')

		},
		//添加事项
		addItem(index) {
			let arr={
				desc: "",
				workunitList:[this.workunitNo1,this.workunitNo2],
				custom: '',
				add:true
			}
			this.list.splice(index+1,0,arr)

		},
		//在进行中+号点击显示事项
		addItems(){
		if(this.isShow){
				this.addMatTers++
			}else{
				this.isShow =true;  //点击X展开事项
			}
		},
		//选择工作单元
		selectUnit(item, unit) {
			// console.log(item, unit)
			// alert(1111)
			 //return false;
			
				if(item.includes('1')){
					if(unit.id == '1'){
						console.log(this.list,'list')
						let state = 0;
						this.list.forEach((v)=>{
							//console.log(v,'v')
							v.workunitList.forEach((v2)=>{
								if(v2 == '1'  && v.status !=2){
									state ++
									return false
								}
							})
						})
						//console.log(state, 'state')
						if(state > 1){
							this.$alert(`未完成的事项中已存在查验计划时，无法选取此工作单元。`, '提示', {
								type: 'warning',
								confirmButtonText: '确定',
								callback: () => {
									item.forEach((v,i)=>{
										if(v == '1'){
											item.splice(i,1)
											return
										}
									})
								}
							})
							
						}
						
					}
			
			}
				
			



			let options = {
				projectNo: this.projectNo,
				matterNo: item.matterNo,
				workunitNo: unit.workUnitNo,
			}
		

		},
		//删除事项
		deleteItem(id, index) {
			this.list.splice(index, 1)
		},
		getMatterList() {
			this.getMatterByProjectList(this.projectNo).then(() => {
				let list = JSON.parse(JSON.stringify(this.matterList))
				if (this.status <=1 ||(this.status==2 && this.edit)) {

					list.forEach(v => {
						let item = []
						let item2 = []
						v.workunitList.forEach(v1 => {
							item.push(v1.workunitNo)
							item2.push(v1.id)
							if (v1.workunitNo == 9) v.custom = v1.workunitName
						})
						v.workunitList = item
						v.ids = item2
						v.add=false
					})
				} else {

					list.forEach(v => {
						if(this.status == 2){
							v.expand = true
						}else{
							v.expand = false
						}

					})
				}
				this.list = list
				if (this.status == 1 && list.length == 0) this.addItem(0)
			})
		},
		init(){
			if (this.status <= 1||(this.status==2&&this.edit)) {
				if (this.status == 1||(this.status==2&&this.edit)){
					this.getMatterList()
				} else {
					this.addItem(0)
					}
				if (this.workunit.length == 0) this.getWorkunitList().then(() => {

				})
			} else {
				this.getMatterList()
				}
		},
		...mapActions('myWork', ['getWorkunitList', 'getMatterByProjectList'])
	},
	created() {
		this.init()
	},
	mounted(){
		this.getAuth()
		//this.getRole()
    //console.log(this.matterList, 'list')
    // let list = [];
    // let data = [];
    // list = self.matterList;
    // list.forEach(function(v,index){
    //   let workunitList = v.workunitList;
    //   let subData = [];
    //   workunitList.forEach(function(v2, index2){
    //     subData.push(v2.workunitNo)
    //   })
    //   data.push(subData)
    // })
    // return data
	}
}
</script>
