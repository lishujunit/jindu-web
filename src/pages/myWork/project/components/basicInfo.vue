<template>
	<div class="boxItem shadow basic" style="margin-top: 20px">
		<div class="allTitle">基本信息
			<el-button style="padding: 8px 15px;" class="fr" v-if="info.chargeLawyerList.length==0" type="primary" @click="chooseLaywer" >指定负责律师</el-button>
			<!-- <el-button class="fr" v-if="info.status==2" type="primary" @click="editMatter" :loading="info.editLoad&&info.edit">{{info.edit?'提交准备事项':'修改准备事项'}}</el-button> -->
		</div>
		<div class="context">

			<div style="overflow: hidden;">
				<div class="item fl" v-if="info.status<2">
					<span class="name">案件编号：</span>
					<span class="txt">
						{{info.caseNo}}
						<div class="status" :class="{'danger':info.status==1||info.status==3}">{{globalStatus.projectStatus[info.status]}}</div>
					</span>
				</div>
				<div class="item fl" v-if="info.status<2">
					<span class="name">案件名称：</span>
					<span class="txt">{{info.caseName}}</span>
				</div>
				<div class="item fl">
					<span class="name">项目编号：</span>
					<span class="txt new_edit">
						<span v-if="info.status>1">
							<!--{{info.projectNo}}-->
							{{projectNo2}}
						</span>
						<span v-if="info.status<2">
							<el-input 
							 
							  type="text"
							  placeholder="请输入内容"
							  v-model='projectNo'
							  @blur="blurfn"
							  @focus="focusfn"
							  :maxlength="20"
							style="width: 6rem;">
						</el-input>
						</span>
						<div class="status" v-if="info.status>1" :class="{'danger':info.status==1||info.status==3}">{{globalStatus.projectStatus[info.status]}}</div>
						<!--<div class="status" :class="{'danger':info.status==1||info.status==3}">{{globalStatus.projectStatus[info.status]}}</div>-->
					</span>
				</div>
				<div class="item fl">
					<span class="name">项目名称：</span>
					<span class="txt new_edit">
						<span v-if="info.status>1">
							{{info.projectName}}
						</span>
						<span v-if="info.status<2">
							<el-input 
								
							  type="text"
							  placeholder="请输入内容"
							  v-model='projectName'
							  @blur="blurfn2"
							  @focus="focusfn2"
							  :maxlength="20"
							style="width: 6rem;">
						</el-input>
						</span>
					</span>
				</div>
				
				<div class="item fl">
					<span class="name">合伙人律师：</span>
					<span class="txt">{{info.sponsorPartner}}</span>
					<!--<span class="txt">
						<template  v-for="item,index in info.sponsorPartnerList">
							{{item.nameCN}}
							<template v-if="index<info.sponsorPartnerList.length-1"></template>
						</template>
					</span>-->
				</div>
			</div>
			<div style="overflow: hidden;">
				<div class="item fl">
					<span class="name">立项时间：</span>
					<span class="txt">{{info.setUpTime}}</span>
				</div>
				<div class="item fl" v-if="info.chargeLawyerList.length>0">
					<span class="name">负责律师：</span>
					<span class="txt">
						<template  v-for="item,index in info.chargeLawyerList">
							{{item.nameEN}}-{{item.nameCN}}
							<template v-if="index<info.chargeLawyerList.length-1">、</template>
						</template>
					</span>
					<el-button round type="primary" plain size="mini" style="margin-left: 10px;" @click="chooseLaywer" v-if="btnShow">调整</el-button>
				</div>
				<div class="item fl" v-if="info.status>1">
					<span class="name">项目类型：</span>
					<span class="txt">{{info.projectTypeDesc}}</span>
				</div>
			</div>
			<div class="item layer" v-if="info.status>1">
				<span class="name">执行律师：</span>
				<!--{{info.execLawyerList}}-->
				<span class="txt">
					<!--{{info.execLawyerList}}-->
					<template  v-for="item,index in info.execLawyerList">
						{{item.nameEN}}-{{item.nameCN}}
						<template v-if="index<info.execLawyerList.length-1">、</template>
					</template>
				</span>
				<el-button round type="primary" plain size="mini" style="margin-left: 10px;" @click="chooseLaywer(1)" v-if="btnShow">调整</el-button>
			</div>
		</div>
	</div>
</template>
<style rel="stylesheet/scss" lang="scss">
	.new_edit{
		
		display: flex !important;
		/*margin-left: -15px;*/
		.el-input--small .el-input__inner{
			height: 26px !important;
			line-height: 26px !important;
		}
		.status{
			height: 18px;
			margin-top: 4px;
		}
		.el-input__icon{
			color: red !important;
			margin-top:2px !important;
			font-size: 16px;
		}
		// .bordernone{
		// 	.el-input__inner{
		// 		border: none !important;
		// 	}
		// }
	}
	
</style>
<script>
import { mapActions } from 'vuex'
import { getProjectInfo,getComplete } from '@/api/mywork'
import { commonAuthApi } from "@/api/commonAuthApi";
export default{
	props:{
		info:Object
	},
	watch:{
		info(oldv,newv){
			this.info.execLawyerList=newv.execLawyerList
			this.info.chargeLawyerList=newv.chargeLawyerList
		}
	},
	mounted(){
		this.projectNo=this.info.projectNo;
		this.projectNo2=this.info.projectNo;
		this.projectName=this.info.projectName
		 let status = this.info.status;
		 let that=this;
//			 if(status == 1 || status == 2){
//				 this.btnShow = true
//			 }else{
//				 this.btnShow = false
//			 }
			 this.getinfos(function(res){
//			 	console.log(res)
			 	that.back_vals(1,res.projectNo,that.info.execLawyerList)
				that.back_vals(0,res.projectNo,that.info.chargeLawyerList)
			 })
			 this.getRole(function(aa){
			 	that.role=aa;
//			 	console.log(that.role)
					if(status == 1){
						that.btnShow = true
					}else if(status == 2){
						if(that.role=='Exec'){
							 that.btnShow = false
						}else{
							that.btnShow = true
						}
					}else{
						 that.btnShow = false
					 }
			 });
	},
	 data() {
		 return{
			 btnShow: false,
			 projectNo:'',
			 projectNo2:'',
			 projectName:'',
			 projectNo_edidt:false,
			 projectName_edidt:false,
			//  bordernone:true,
			//  bordernone2:true,
			execLawyerList2:[],
			role:''
		 }
	 },
	methods:{
		back_vals(type,projectNo,sourceData){
      		getComplete({projectNo:projectNo,type:type}).then((res)=>{
//	      		let newvals=sourceData;
//    				console.log(sourceData)
//    				console.log(res)
      			if(res.code==0){
						sourceData.forEach(v1=>{
//							console.log(v1)
							res.result.forEach(v2=>{
//								console.log(v2)
								if(v2.id==v1.id){
									v1.nameEN=v2.nameEN
								}
							})
						});
				}
				return sourceData;
      		})
      	},
		getRole(callback) {
			commonAuthApi(this.projectNo).then(res => {
//				this.role = res.result;
			callback&&callback(res.result)
			})
		},
		getinfos(callback){
			
			getProjectInfo(this.projectNo).then(res => {
				if (res.code == 0) {
//					console.log(res.result)
//					alert('4444446')
          			this.execLawyerList2 = res.result.execLawyerList
          			callback&&callback(res.result)
//        			console.log(this.execLawyerList2)
//        			console.log(this.info.execLawyerList)
				}
			})
		},
		focusfn(){
			//this.bordernone=false;
		},
		blurfn(){
			this.projectNo_edidt=false;
			//this.bordernone=true;
			if(this.projectNo!=''){
//				this.info.projectNo=this.projectNo
				this.projectNo2=this.projectNo
			}else{
				this.projectNo=this.projectNo2
			}
			this.$emit("sendprojectNo",this.projectNo2) 
//			console.log(this.projectNo2,'this.projectNo2')
//			console.log(this.info.projectNo,'this.info.projectNo')
//			console.log(this.info.projectNo,'9999')
		},
		edidt() {
        	this.projectNo_edidt=true
        	this.projectNo=this.info.projectNo
        	
      	},
      	focusfn2(){
      		//this.bordernone2=false;
      	},
      	blurfn2(){
			this.projectName_edidt=false;
			//this.bordernone2=true;
			if(this.projectName!=''){
				this.info.projectName=this.projectName
			}else{
				this.projectName=this.info.projectName
			}
			 this.$emit("sendprojectName",this.info.projectName) 
//			console.log(this.info.projectName,'8888')
		},
		edidt2() {
        	this.projectName_edidt=true
        	this.projectName=this.info.projectName
      },
		chooseLaywer(type){
			this.btnShow=true;
			const new_execLawyerList=this.info.execLawyerList;
			const new_chargeLawyerList=this.info.chargeLawyerList;
			
			getComplete({projectNo: this.info.projectNo,type:type}).then((res)=>{
				if(res.code==0){
//				console.log(res.result)
				if(type && type==1){
					new_execLawyerList.forEach(v1=>{
						res.result.forEach(v2=>{
							if(v2.id==v1.id){
								v1.nameEN=v2.nameEN
							}
						})
					})
//					console.log(new_execLawyerList)	
					this.$emit('chooseLaywer',1,new_execLawyerList)
				}else{
					new_chargeLawyerList.forEach(v1=>{
						res.result.forEach(v2=>{
							if(v2.id==v1.id){
								v1.nameEN=v2.nameEN
							}
						})
					})
					this.$emit('chooseLaywer',0,new_chargeLawyerList)
//				console.log(new_chargeLawyerList)	
				}
				
				}
			})
//			if(type && type==1){
//				this.$emit('chooseLaywer',1,new_execLawyerList)
//			}else{
//				this.$emit('chooseLaywer',0,new_chargeLawyerList)
//			}
//			this.$emit('chooseLaywer',0,this.info.chargeLawyerList)
//			this.setchargeLawyerList(this.info.chargeLawyerList)
		},
		...mapActions('myWork', ['setchargeLawyerList'])
		//修改准备事项
		// editMatter(){
		// 	this.btnShow=!this.btnShow
		// 	this.$emit('editMatter')
		// }
	}
}
</script>
