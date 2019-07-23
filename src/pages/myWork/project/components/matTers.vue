<template>
		<div>
				<template>
					<!-- {{PisShow}} -->
						<div class="inputList" v-for="item,index in matterListData">
						<div class="top">
								<div class="name fl">
									<!-- <span>事项{{listnuber.length+1 + index}}：</span> -->
									<span>事项名称：</span>
									<el-input size="mini" type="text" v-model="item.desc" placeholder="请输入事项名称" :maxlength="20"></el-input>
								</div>
								<!-- matterListData.length>1&& -->
								<div class="add delete" @click="deleteItem(item.matterNo,index)" v-if="item.add">
									<i class="el-icon-close"></i>
								</div>
								<div class="add" @click="addItem(index)" v-if="status!=2">
									<i class="el-icon-plus"></i>
								</div>
								<div class="add" @click="Submission(index)">
									<i class="el-icon-check"></i>
								</div>
							</div> 
								<!-- :disabled="item.workunitList.indexOf(unit.workUnitNo) > -1 && (unit.workUnitNo == '1' || unit.workUnitNo == '2')"  默认置灰 -->
							<div class="unit">
								<el-checkbox-group v-model="item.workunitList">
									<el-checkbox
									:label="unit.workUnitNo"
									v-for="unit in myData"	
									:class="{'custom':unit.workUnitNo=='9'}"
									@change="selectUnit(item.workunitList,unit)"
									> {{unit.workUnitName}}</el-checkbox>
									<el-input v-model="item.custom" size="mini" v-if="item.workunitList.indexOf('9')>-1" :maxlength="20"></el-input>
								</el-checkbox-group>
							</div>
					</div>
				</template>
		</div>
    
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { getMatterInfo, getWorkunit} from '@/api/mywork'
export default {
	name: "matters",
	props:{
		PisShow:Boolean,
		listnuber:Array,
		matterIndex: Number,
		addMatTers: Number,
		status: Number,
	},
    computed: {
		
			...mapState('myWork', ['workunit', 'matterList'])
		},
    data() {
			return {
				myData: null,
				workunitNo1:'',
				workunitNo2:'',
				matterListData: [],
				workunitList: [],
				item:{
					desc:'',
					custom:'',
				},
				isRouterAlive: true
			
			}
		},
		watch:{
			PisShow(curVal,oldVal){
					//console.log(curVal,oldVal)
					this.matterListData.push({
						desc: "",
						workunitList:['',''],
						custom: '',
						add:true
					})
			},
			matterIndex(newVal, oldVal){
				if(newVal != -1){
				  this.matterListData.splice(newVal,1)
				}
			},
			addMatTers(){
				this.addItem(this.matterListData.length)
			}
		},
    methods:{
		// 工作单元列表
		websites() {
			getWorkunit().then(res => {
				this.myData = res.result;	
			});
		},
		//选择工作单元
		selectUnit(item, unit) {
			console.log(item,unit)
			if(item.includes('1')){
				if(unit.id == '1'){
					let state = 0;
					this.matterListData.forEach((v)=>{
						 v.workunitList.forEach((v2)=>{
							 if(v2 == '1'){
								state ++
							}
						})
					})
						this.matterList.forEach((v)=>{
							v.workunitList.forEach((v2)=>{
								if(v2.workunitNo == '1' && v.status !=2){
									state ++
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
			
			//return
			let options = {
				projectNo: this.projectNo,
				matterNo: item.matterNo,
				workunitNo: unit.workUnitNo,
			}
			
		},
		//添加事项
		addItem(index) {
			let arr={
				desc: "",
				workunitList:['',''],
				custom: '',
				add:true
			}
			this.matterListData.push(arr)		
		},
		//删除事项
		deleteItem(id, index) {
			this.matterListData.splice(index, 1)
			 
		},
		Submission(index){
			let matter = []
			let status = true;
			this.matterListData.forEach((v,i)=>{
					let item = {
					name: v.desc,
					workUnits: []
				}
					v.workunitList.forEach((v1) => {
						if (v1 == '9') {
							item.workUnits.push({
								id: v1,
								name: v.custom,
								workunitId: ''
							})
							//item.custom = i1
						} else {
							item.workUnits.push({ id: v1, workunitId: '',name: ''})
						}
					
					})
					if(index == i){
						matter.push(item)
							let ss=v.workunitList;
							for (var i = 0; i < ss.length; i++) {
								if (ss.length == 2 && !ss[0].checked && !ss[1].checked) {
										this.$alert(`工作单元未勾选`, '提示', {
										type: 'warning',
										confirmButtonText: '确定',
										callback: () => {}
									})
										status = false;
										return false
								}

							}

							if(v.desc==""){
								this.$alert(`事项名称没有输入`, '提示', {
									type: 'warning',
									confirmButtonText: '确定',
									callback: () => {}
								})
								status = false;
								return false
							}
					}
					
			
			
			})
			if(status){
				this.$emit('newMatter',matter, index)
			}
			
		//console.log(matter)
		
		},
		...mapActions('myWork', ['getWorkunitList', 'getMatterByProjectList'])
  },
	mounted(){
		this.websites();
	}
}
</script>