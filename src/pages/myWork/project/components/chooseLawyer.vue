<template>
	<el-dialog width="510px" :visible.sync="visible" class="laywer" @close="closeDialog" :before-close="handleClose" :close-on-click-modal="false">
		<div slot="title">{{title}}{{type==0?'负责律师指定':'执行律师指定'}}</div>
		<div class="context">
			<div class="fl">
			<!--	<el-input v-model="search" @keyup.13.native="searchPeople" :fetch-suggestions="querySearch" :trigger-on-focus="false"></el-input>-->

				<el-autocomplete v-model="search" 
				:fetch-suggestions="querySearch" 
				 clearable
				@clear="handleUpClear"
				@select="handleUploader"
				></el-autocomplete>

				<!-- <div class="list" v-for="item in completeList">
					<div class="outer" @click="item.expand=!item.expand">
						<i :class="{'el-icon-arrow-right':!item.expand,'el-icon-arrow-down':item.expand}"></i>
						<span>{{item.name}}</span>
					</div>
					<div class="inner" v-show="item.expand">
						<ul v-if="item.completeList.length>0">
							<li v-for="name in item.list" @click="choose(name)">
								<span class="avatarBox">
									<div class="avatar"><img :src="name.avatar"></div>
									<div class="name">{{name.name}}</div>
								</span>
							</li>
						</ul>
						<div class="noData" v-else>暂无成员！</div>
					</div>
				</div> -->
				<div class="list">
					<div class="outer"  @click="expand=!expand">
						<i :class="{'el-icon-arrow-right':!expand,'el-icon-arrow-down':expand}"></i>
						<span>律师列表</span>
					</div>
					<div class="inner">
						<ul v-if="listData.length>0">
							<li v-show="expand" v-for="item in listData" @click="choose(item)">
								<span class="avatarBox">
									<div class="name">{{item.nameEN}}-{{item.nameCN}}</div>
								</span>
							</li>
						</ul>
						<div class="noData" v-else>暂无成员！</div>
					</div>
				</div>
			</div>
			<div class="fr">
				<div class="list">
					<div class="outer" @click="expand2=!expand2">
						<i :class="{'el-icon-arrow-right':!expand2,'el-icon-arrow-down':expand2}"></i>
						<span>已选择成员</span>
					</div>
					<div class="inner" v-show="expand2">
						<ul v-if="list.length>0">
							<li v-for="item,index in list">
								<span class="avatarBox">
									<div class="name">{{item.nameEN}}-{{item.nameCN}}</div>
								</span>
								<i class="el-icon-error danger" @click="deleteItem(item)"></i>
							</li>
						</ul>
						<div class="noData" v-else>暂无选择！</div>
					</div>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="danger" @click="lists">重置</el-button>
			<!-- <el-button type="primary" @click="submit">确定</el-button> -->
			<el-button type="primary" @click="checked">确定</el-button>
		</div>
	</el-dialog>
</template>
<script>
import {getComplete} from '@/api/mywork'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
	watch:{
		dialogVisible(){
			this.visible=this.dialogVisible
//			console.log(this.mychargeLawyerList)
			//this.searchPeople()
			if(this.visible){
//				console.log(this.mychargeLawyerList,'mychargeLawyerList')
//				console.log(this.myexecLawyerList,'myexecLawyerList')
				if(this.type==0){
					this.list=this.mychargeLawyerList
				}else{
					this.list=this.myexecLawyerList
				}
//				console.log(this.list)
			}
			this.querySearch()
		},
		chooseList(){
//    if(this.status == 0){
//    	console.log(this.chooseList)
        this.list=JSON.parse(JSON.stringify(this.chooseList))
//    }
    },
    // unList(){
    //   if(this.status == 0){
    //     this.list = JSON.parse(JSON.stringify(this.unList))
    //   }
    // }
	},
	computed: {
		allList(){
			let list=[]
			this.completeList.forEach(v=>{
				let is=false
				this.unList.forEach(v1=>{
					if(v.id==v1.id) is=true
        })
        if(this.status == 0){ //未开始
          if(is) list.push(v)
        }else{
          if(!is) list.push(v)
        }
			})
			return list
		},
       ...mapState('myWork', ['completeList','mychargeLawyerList','myexecLawyerList'])
   	},
	props:{
		title:'',
		dialogVisible:Boolean,
		projectNo:'',
		type:Number,
		chooseList:Array,
		unList:Array,
		status: Number,
	},
	data() {
		return {
			search: '',
			visible:false,
			expand:true,
			expand2:true,
			list:[],
			listData:[]
		}
	},
	methods: {
		checked(){ //确定选择负责律师
//			console.log(this.list)
			if(this.list.length!=0){
				this.$emit('checked',this.list)
			}else{
				let msg='负责律师';
				if(this.type==1){
					//执行律师
					msg='执行律师'
				}
				this.$alert("请至少选择一位"+msg+"！", '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    callback: () => {}
                })
//				this.list=this.mychargeLawyerList
                return false
			}
		},
		//点击x关闭清空内容
	    handleClose(done){
			//	alert(123)
	    　　done();
	      //  location.reload();
	    },
		    //模糊查询
	     querySearch(queryString, cb) {
			  	let VM=this
					let option={
								projectNo:this.projectNo,
								type:this.type,
								key:this.search
							}
	       this.getCompleteList(option).then(res => {
							VM.listData = res.result;
							let selectList=[]
							if(res.code==0){
			                    res.result.forEach(v=>{
			                        selectList.push({value:v.nameCN})
			                    })
			                }
//						for(let i = 0; i < VM.listData.length; i++){
//							selectList.value = VM.listData[i].nameCN
//						}
						var results = queryString ? selectList.filter(VM.createStateFilter(queryString)) : selectList;
							cb(results);
						})
					.catch(error => {});
			},
			createStateFilter(queryString) {
				return (state) => {
				return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
		},
		handleUpClear(){
				this.search = "";
    },
		handleUploader(item) {
				this.search = item.value;
				this.querySearch()
		},
		//确定
		submit(){
		},
		//重置
		lists(index){
			this.list=[]
		},
		//选择成员
		choose(item) {
			let is=false
			this.list.forEach(v=>{
				if(v.id==item.id){
					is = true
				}
			})
			if(!is){
          this.list.push(item);
        
      }
		},
		//删除成员
		deleteItem(item) {
      let id = item.id;
      this.list.forEach((v,i,arr)=>{
        if(id == v.id){
            arr.splice(i,1)
        }
      })

		},
		//关闭弹框
		closeDialog(){
			this.$emit('closeDialog',this.visible)
			
		},
		...mapActions('myWork', ['getCompleteList'])
	},
	mounted(){
		
	}
}
</script>
<style rel="stylesheet/scss" lang="scss">
@import '@/assets/css/details.scss'
</style>
<!--<style rel="stylesheet/scss" lang="scss">
.laywer .el-dialog{
		left: 400px !important;
	}
</style>-->