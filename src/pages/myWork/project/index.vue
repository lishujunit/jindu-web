<template>
	<div>
		<!-- 项目详情页 -->
		<title-bar @goBack="goBack" :title="info.projectName" style="margin-bottom: 20px"></title-bar>
		<basic-info :info="info" v-if="info.projectNo" @sendprojectName="sendprojectName" @sendprojectNo='sendprojectNo' @chooseLaywer="chooseLaywer" @editMatter="editMatter"></basic-info>
		<matter-info :info="info" :isAddMatter="isAddMatter" :matterIndex="matterIndex" :edit="info.edit" @addMatter="addMatter" :status="info.status" :projectNo="projectNo" v-if="info.status>1" ref="matter2" @editMatter="editMatter"></matter-info>

		<search-info :status="info.status" :projectNo="projectNo"></search-info>
		<div class="boxItem shadow type" v-if="info.status<2">
			<div class="fl" style="margin-right: 148px;">
				<div class="allTitle">项目类型</div>
				<el-select class="select" v-model="info.projectType">
					<el-option v-for="item in projectTypeList" :label="item.value" :value="item.key"></el-option>
				</el-select>
			</div>
			<div class="fl">
				<div class="allTitle">机构类型</div>
				<el-select class="select" v-model="info.organizationType">
					<el-option v-for="item in organizationTypeList" :label="item.value" :value="item.key"></el-option>
				</el-select>
			</div>
		</div>
		<div class="boxItem shadow member" v-if="info.status<2">
			<div class="allTitle">项目成员</div>
			<div class="list" v-if="info.execLawyerList.length>0">
				<span class="avatarBox" v-for="exec in info.execLawyerList">
					<div class="name">{{exec.nameEN}} - {{exec.nameCN}} <i class="el-icon-error" @click="handleDel(exec)"></i></div>
				</span>
			</div>
			<div style="margin-top: 10px;cursor: pointer;display: inline-block;" @click="chooseLaywer(1,info.execLawyerList)">
				<div class="add">
					<i class="el-icon-plus"></i>
				</div>
				<span class="var">选择项目组成员</span>
			</div>
		</div>
		<process-info :projectNo="projectNo" :status="info.status" v-if="info.status>0"></process-info>
		<matter-info :info="info" :edit="info.edit" :status="info.status" v-if="info.status<2" :projectNo="projectNo" ref="matter"></matter-info>
		<keep-alive>
		<chooseLawyer
	    @delItem="deleteItem"
	    @addItem="addItem"
		@checked="checked"
    	:unList="dialog.unList" :status="this.info.status"
		:chooseList="dialog.chooseList" :type="dialog.type"
		:projectNo="info.projectNo" :title="info.projectName" :dialogVisible="dialog.visible" @closeDialog="closeDialog" @submit="submit"></chooseLawyer>
		</keep-alive>
		<div style="text-align: center;margin: 50px 0;">
			<el-button type="primary" @click="submitNext" :loading="submitLoad" v-if="info.status<2">提交</el-button>
			<el-button type="primary" v-if="role=='Partnership'&& info.status==2" :loading="submitLoad" @click="completePro">结束</el-button>
		</div>
	</div>
</template>
<script>
import { basicInfo, searchInfo, matterInfo, processInfo, chooseLawyer } from './components/'
import { getProjectInfo, getProjectType, getOrganizationType, submitProject, complete, editMatterInfo, updateResLawyer, getComplete, getRole,updateExeLaywers,updateResLaywers } from '@/api/mywork'
import { mapState, mapMutations, mapActions } from 'vuex'
import { debuglog } from 'util';
import { getMatterInfo } from '@/api/mywork'
export default {
	components: {
		basicInfo,
		searchInfo,
		matterInfo,
		processInfo,
		chooseLawyer,
	},
	computed: {
		...mapState('myWork', ['projectTypeList', 'organizationTypeList'])
	},

	data() {
		return {
			projectNo: '',
      info: {},
      role: '',
			dialog: {
				visible: false,
				type: 0, //0 负责律师 1执行律师
				chooseList: [],
				unList:[]
			},
			submitLoad: false,
			matter: [],
			userData: [],
			isData:false,
			userData1:[],
			projectNo_temporary:'',
			projectName_temporary:'',
			isAddMatter: 1,
			matterIndex: -1
		}
	},
	methods: {
		checked(lists){
//			console.log(lists)
			this.dialog.visible = false;

//			if(this.dialog.type == 0){ //未开始
//				 alert('haha01')
				let data1 = this.info.chargeLawyerList; //负责律师
				let data2 = this.info.execLawyerList; //项目成员
				let data3 = this.userData; //全部律师

				this.info.chargeLawyerList.forEach((v)=>{
					// this.info.execLawyerList.forEach((v2,i)=>{
					// 	if(v.id == v2.id){
					// 		this.info.execLawyerList.splice(i,1)
					// 	}
					// })
				})
//				console.log(this.info.chargeLawyerList)
//				console.log(this.info.execLawyerList)
//				console.log(lists)
				const ids=[];
				if(lists.length!=0){
					lists.forEach(v=>{
						ids.push(v.id)
					})
				};
//				console.log(ids)
				if(this.dialog.type == 0){
					//负责律师列表
//					console.log(this.info)
					this.info.chargeLawyerList=lists;
					this.setchargeLawyerList(this.info.chargeLawyerList);
					//调用更新负责律师列表接口
					if(this.info.status==2){
							updateResLaywers(this.projectNo,ids)
					}

				}else{
					this.info.execLawyerList = JSON.parse(JSON.stringify(this.userData));
					//执行律师
//					console.log(this.info.execLawyerList,'this.info.execLawyerList')
					this.info.execLawyerList=lists;
//					console.log(this.info.execLawyerList,'this.info.execLawyerList')
					this.setexecLawyerList(this.info.execLawyerList)
							if(this.info.status==2){
									updateExeLaywers(this.projectNo,ids)
							}

				}


//    }else{
//      //
////      alert('haha02')
//    }
		},
		//添加负责律师
    addItem(item){
//		console.log(item,'addItem')
		let self = this;
      if(this.dialog.type == 0){
//      this.info.chargeLawyerList.push(item)
		}else{
		let status = false;
		this.info.chargeLawyerList.forEach(function(v){
			if(v.id == item.id){
				status = true
			}
		})
		if(status == false){
			this.info.execLawyerList.push(item)
			}else{
			//	alert('该律师已选为负责律师')
			this.$message({
					type: "info",
					message: "该律师已选为负责律师"
				});
			}
		}

    },
    deleteItem(id){
			if(this.dialog.type == 0){
				let data = this.info.chargeLawyerList;
				data.forEach((v,i,arr)=>{
					if(v.id == id){
						arr.splice(i,1)
					}
				})
			}else{
				let data = this.info.execLawyerList;
				data.forEach((v,i,arr)=>{
					if(v.id == id){
						arr.splice(i,1)
					}
				})
			}

    },
    handleDel(member){
      let id = member.id;
      let execLawyerList = this.info.execLawyerList;
      execLawyerList.forEach((v, i, arr)=>{
        if(id == v.id){
          arr.splice(i,1)
        }
      })
    },
		//选择律师
		chooseLaywer(type,vals) {
//			alert(type)
//			this.setchargeLawyerList(vals)
      this.dialog.type=type
//    if(this.info.status == 0){ //未开始
        if (type == 0) {
          this.dialog.chooseList = this.info.chargeLawyerList
          this.setchargeLawyerList(vals)
          //this.dialog.unList=this.info.execLawyerList
        }else {
         this.dialog.chooseList = this.info.execLawyerList
         this.setexecLawyerList(vals)
          //this.dialog.unList=this.info.chargeLawyerList
        }
//    }

			this.dialog.visible = true

		},
		/*点击返回*/
		goBack() {
		    let from = this.$route.query.from;
			if (from == 'message'){
			    this.$router.go(-1)
			    // this.$router.push({path:'/systemMessage'})
			} else{
                this.$router.push({ name: 'myWork' })
			}
			// this.$router.push({ name: 'myWork' })
		},
		//关闭弹框
		closeDialog(visible) {
			this.dialog.visible = visible;
			if(this.dialog.type==0){
				this.setchargeLawyerList([])
			}else{
				this.setexecLawyerList([])
			}
//			this.setchargeLawyerList([])
			this.dialog.chooseList=[]
		},
		//选择人工的弹框，点击提交的回调
		submit(list) {
			if(this.info.status==3){
			//	console.log()
				this.isShow=false
			}
			// if (list.length == 0) {
			// 	let msg = ""
			// 	switch (this.dialog.type) {
			// 		case 0:
			// 			msg = "请选择负责律师！"
			// 			break
			// 		case 1:
			// 			msg = "请选择执行律师！"
			// 			break
			// 		default:
			// 			msg = "请选择律师！"
			// 	}
			// 	this.$alert(msg, '提示', {
			// 		type: 'warning',
			// 		confirmButtonText: '确定',
			// 		callback: () => {}
			// 	})
			// 	return false
			// }
			if(this.info.status==2){
				if(this.dialog.type==0){
					let ids=[]
					list.forEach(v=>{
						ids.push(v.id)
					})
					updateResLawyer({projectNo:this.projectNo,laywerIds:ids}).then(res=>{
						if(res.code==0){
							this.$message({
								type:'success',
								message:'调整成功！'
							})
							this.dialog.visible = false
							this.info.chargeLawyerList = list
						}
					})
				}
			}else{
				this.dialog.visible = false
				switch (this.dialog.type) {
					case 0:
						this.info.chargeLawyerList = list
						break
					case 1:
						this.info.execLawyerList = list
//						console.log(this.info.execLawyerList)
						break
				}
			}


		},
		sendprojectNo(val){
			this.projectNo_temporary=val;
		},
		sendprojectName(val){
			this.projectName_temporary=val;
		},
		//提交准备
		submitNext() {
			this.matter = JSON.parse(JSON.stringify(this.$refs.matter.matterInfo))
			if (!this.validateMatter()) {
					return false
			}
			let respIds = []
			this.info.chargeLawyerList.forEach(v => {
				respIds.push(v.id)
			})
			let execIds = []
			this.info.execLawyerList.forEach(v => {
				execIds.push(v.id)
			})
			const oldprojectNo=this.info.projectNo;
			 this.projectNo=this.projectNo_temporary?this.projectNo_temporary:this.projectNo;

			this.info.projectName=this.projectName_temporary?this.projectName_temporary:this.info.projectName;
			let options = {
				projectTypeId: this.info.projectType,									//项目类型
				organizationTypeId: this.info.organizationType,      //机构类型
				respIds: respIds,
				execIds: execIds,
				caseNo:this.info.caseNo,      //3E案件号
				caseName:this.info.caseName,
				matterList: this.matter,
				projectNo: this.projectNo,
				projectName:this.info.projectName,

			}
			let data = {
				options: options,
				projectNo: oldprojectNo
			}
			this.submitLoad = true
			if(this.info.status==0){
				//未开始状态时提交前必须选择负责律师
				if(this.info.chargeLawyerList.length==0){
					this.$alert("负责律师不能为空！", '提示', {
	                    type: 'warning',
	                    confirmButtonText: '确定',
	                    callback: () => {}
	               })
					this.submitLoad = false
					return false;
				}
			}
			// 	let ss=v.workUnits;
			// 	for (var i = 0; i < ss.length; i++) {
			// 	if (ss.length == 2 && !ss[0].checked && !ss[1].checked) {
			// 			this.$alert(`工作单元未勾选`, '提示', {
			// 			type: 'warning',
			// 			confirmButtonText: '确定',
			// 			callback: () => {}
			// 		})
			// 			return
			// 	}

			// }
			submitProject(data).then(res => {
				this.submitLoad = false
				if (res.code == 0) {
					this.$message({
						type: 'success',
						message: '提交成功！'
					})
					this.getInfo()
//					getProjectInfo(data.projectNo).then(res => {
//						if (res.code == 0) {
//							this.info = res.result
//						}
//					})
					if(this.info.status==0){
						this.$router.push({ name: 'myWork' })
					}else{
						this.$router.push({path:'/myWork/details/'+this.projectNo})
					}
//					this.getInfo()
				}
			}).catch(() => {
				this.submitLoad = false
			})
		},
		addMatter(matter, index){
			//console.log(matter, 'pp')
			this.editMatter(matter, index)
		},
		back_vals(type,projectNo,sourceData){
      		getComplete({projectNo:projectNo,type:type}).then((res)=>{
	      		let newvals=sourceData;
      			if(res.code==0){
						newvals.forEach(v1=>{
//							console.log(v1)
							res.result.forEach(v2=>{
//								console.log(v2)
								if(v2.id==v1.id){
									v1.nameEN=v2.nameEN
								}
							})
						});
					return newvals;
				}
      		})
      	},
		//获取案件信息
		getInfo(callback) {
		//	alert('1111111111')
			if (this.projectTypeList.length == 0) this.getProjectTypeList().then(() => {})     //项目类型
			if (this.organizationTypeList.length == 0) this.getOrganizationTypeList().then(() => {})    //机构类型
			getRole(this.projectNo).then((res)=>{
				if(res.code == 0){
				this.role = res.result
				}
			})
			getProjectInfo(this.projectNo).then(res => {
//				alert('22222222222222')
				if (res.code == 0) {
					res.result.status = Number(res.result.status)
					res.result.edit = false
					//res.result.editLoad = false
					this.info = res.result
						callback&&callback(res.result)
			//        console.log(this.info.execLawyerList)
					if(this.info.status == 0){ //状态为未开始
			//          getComplete({projectNo: this.projectNo,type:1}).then((res)=>{
			//            if(res.code == 0){
			//					this.info.execLawyerList = res.result
			//					this.userData = JSON.parse(JSON.stringify(this.info.execLawyerList))
			//
			//            }
			//          })
					}
            getRole(this.projectNo)
				}
			})

		},
		//结束项目
		completePro() {
			// if(this.info.status==0){
			// 	this.$alert("未开始不能点击结束", '提示', {
			// 		type: 'warning',
			// 		confirmButtonText: '确定',
			// 		callback: () => {}
			// 	})
			// 	return
			// }
			if(this.info.status!=2){
				//console.log(this.info.status)
				this.$alert("事项未完成", '提示', {
					type: 'warning',
					confirmButtonText: '确定',
					callback: () => {}
				})
				return
			}else{
				this.submitLoad = true
				complete(this.projectNo).then(res => {
					console.log(res,'complete')
					this.submitLoad = false
					if (res.code == 0) {
						this.$message({
							type: "success",
							message: '操作成功！'
						})
						this.getInfo()
					}
				}).catch(() => {
					this.submitLoad = false
				})
			}
		},
		/*项目进行中时，点击准备修改事项，项目状态变成准备中*/
		editMatter(newMatter, index) {
			// if(newMatter){
			// 	this.info.edit = true;
			// 	this.$refs.matter2.init;
			// }
			if (this.info.edit || newMatter) {
				if(newMatter){
					getMatterInfo(this.projectNo).then(res=>{
						let ma = res.result;
						let matter = []
						if(ma.length>0){
							ma.forEach(v=>{
								let item = {
								name: v.desc,
								matterNo: v.matterNo,
								workUnits: []
							}
								v.workunitList.forEach((v1) => {
									if (v1.workunitNo == '9') {
										item.workUnits.push({
											id: v1.workunitNo,
											name: v1.workunitName,
											workunitId: v1.id
										})
										//item.custom = i1
									} else {
										item.workUnits.push({ id: v1.workunitNo, workunitId: v1.id})
									}
								})
							matter.push(item)
						})
						}

						let data = matter.concat(newMatter)
						//console.log(data, 'data')
						//return false
						this.matterIndex = index
						editMatterInfo({ projectNo: this.projectNo, matters: data }).then(res => {
							this.info.editLoad = false
							if (res.code == 0) {
								this.$message({
									type: 'success',
									message: '修改成功！'
								})
								//this.$router.go(0)
								this.isAddMatter++

								this.matterIndex = -1
							}

						})
					})
					return false
				}

				this.matter = JSON.parse(JSON.stringify(this.$refs.matter2.matterInfo))
				//console.log(newMatter, 'new', this.matter)
				//this.matter.concat(newMatter)
				if (this.matter.length == 0){
					 this.info.edit = false
					 }else {
							if (!this.validateMatter()) {
								return false
						}
					this.info.editLoad = true
					editMatterInfo({ projectNo: this.projectNo, matters: this.matter }).then(res => {
						console.log(res,'res')
						this.info.editLoad = false
						if (res.code == 0) {
							this.$message({
								type: 'success',
								message: '修改成功！'
							})
							this.info.edit = false
						}
					}).catch(() => {
						this.info.editLoad = false
					})
				}

			} else {
				this.info.edit = true
				}
		},
		/*判断事项*/
		validateMatter() {
			let is = true
			this.matter.forEach((v, i) => {
				// 	let ss=v.workUnits;
				// 	for (var i = 0; i < ss.length; i++) {
				// 	if (ss.length == 2 && !ss[0].checked && !ss[1].checked) {
				// 			this.$alert(`工作单元未勾选`, '提示', {
				// 			type: 'warning',
				// 			confirmButtonText: '确定',
				// 			callback: () => {}
				// 		})
				// 			return
				// 	}

				// }
				if (!is) return false
				if (v.name.trim().length == 0 && this.info.status==1) {
					this.$alert(`事项名称没有输入`, '提示', {
						type: 'warning',
						confirmButtonText: '确定',
						callback: () => {}
					})
					is = false
					return false
				}

				if (v.custom > -1 && v.workUnits[v.custom].name=="") {
					if(v.workUnits[v.custom].name==""){
						this.$alert(`事项自定义工作单元没有输入名称！`, '提示', {
						type: 'warning',
						confirmButtonText: '确定',
						callback: () => {}
						})
						is = false
						return false
					}
				}

				// return
				delete v.custom
			})
			return is
		},
		...mapActions('myWork', ['getProjectTypeList', 'getOrganizationTypeList','setchargeLawyerList','setexecLawyerList'])

	},
	mounted() {
		const that=this;
		this.getInfo(function(res){
//		console.log(res)
			that.back_vals(1,res.projectNo,res.execLawyerList)
			that.back_vals(0,res.projectNo,res.chargeLawyerList)
		});
//		console.log(this.info)
	},
	created() {
		this.projectNo = this.$route.params.id

	}
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '@/assets/css/details.scss'
</style>
