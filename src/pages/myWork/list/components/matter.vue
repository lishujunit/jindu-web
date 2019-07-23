<template>
	<el-table :data="list" border v-loading="loading" :show-header="false" ref="table" @expand-change="expandChange">
		<el-table-column width="1" type="expand">
			<template slot-scope="scopePar">
				<el-table :data="scopePar.row.workunitList" border :show-header="false" :row-key="getRowKeys" @row-click="rowClick">
					<el-table-column width="1" type="expand"></el-table-column>
					<el-table-column align="center" width="200px"></el-table-column>
					<el-table-column align="center">-</el-table-column>
					<el-table-column align="center" width="120px">-</el-table-column>
					<el-table-column align="center" width="170" prop="createTime"></el-table-column>
					<el-table-column align="center" width="400">
						<template slot-scope="scope">
							<!--<div class="var under">{{scope.row}}</div>-->
							<router-link v-if="scope.row.workunitNo==6" :to="{path: role ? '/netCheck/'+scope.row.id + '/auditData' : '/netCheck/'+scope.row.id, query: { projectNoDefault:id, workunitId: scope.row.id, from: 'list', matterStatus: scopePar.row.status }}" class="var under">{{scope.row.workunitName}}</router-link>
							<router-link v-if="scope.row.workunitNo==2" :to="{path:'/dueDiligence/createRepertoire/'+scope.row.id,query:{matterNo:scope.row.matterNo,projectNo:id,from:'list'}}" class="var under">{{scope.row.workunitName}}</router-link> <!-- 尽调文件收集与处理 -->
							<router-link v-if="scope.row.workunitNo==7" :to="{path:role?'/complianceCertification/confirmPlans/'+scope.row.id : '/complianceCertification/createPlans/'+scope.row.id,query:{projectNo:id,status: scopePar.row.status,from:'list'}}" class="var under">{{scope.row.workunitName}}</router-link>
							<router-link v-if="scope.row.workunitNo==8" :to="{path:role?'/workUnitInquiry/unitConfirm/'+scope.row.id:'/workUnitInquiry/unitCreate/'+scope.row.id,query:{projectNo:id,status: scopePar.row.status,from:'list'}}" class="var under">{{scope.row.workunitName}}</router-link>
							<router-link v-if="scope.row.workunitNo==1" :to="{path:role?'/inspectionPlan/checkPlan/'+scope.row.id : '/inspectionPlan/inspectionCreate/'+scope.row.id,query:{projectNo:id,status: scopePar.row.status,from:'list'}}" class="var under">{{scope.row.workunitName}}</router-link>
							<router-link v-if="scope.row.workunitNo==9" :to="{path:role?'/selfDefine/checkFiles/'+scope.row.id : '/selfDefine/uploadFiles/'+scope.row.id,query:{name:scope.row.workunitName,status: scopePar.row.status,projectNo:id,from:'list'}}"  class="var under">{{scope.row.workunitName}}</router-link><!-- 自定义 -->
							<router-link v-if="scope.row.workunitNo==3" :to="{ path: role ? '/manageInterview/'+scope.row.id+'/confirmPlan' : '/manageInterview/'+scope.row.id, query: { projectNo: id, from: 'list', matterStatus: scopePar.row.status  }}" class="var under">{{scope.row.workunitName}}</router-link> <!-- 管理层访谈 -->
							<router-link v-if="scope.row.workunitNo==4" :to="{ path: role ? '/partnersInterview/'+scope.row.id+'/partnersConfirmPlan' : '/partnersInterview/'+scope.row.id, query: { projectNo: id, from: 'list', matterStatus: scopePar.row.status }}" class="var under">{{scope.row.workunitName}}</router-link> <!-- 业务伙伴访谈 -->
							<router-link v-if="scope.row.workunitNo==5" :to="{ path: role ? '/regulatoryInterview/'+scope.row.id+'/regulatoryConfirmPlan' : '/regulatoryInterview/'+scope.row.id, query: { projectNo: id, from: 'list', matterStatus: scopePar.row.status }}" class="var under">{{scope.row.workunitName}}</router-link> <!-- 监管部门访谈 -->
							<!--<div class="var under">{{scope.row.workunitName}}&#45;&#45;{{scope.row.workunitNo}}</div>-->

						</template>
					</el-table-column>
					<el-table-column label="操作"  align="center" width="140">
						<template slot-scope="scope">
							<div class="btn-box">
								<router-link v-if="scope.row.workunitNo==3" :to="{ path: role ? '/manageInterview/'+scope.row.id+'/confirmPlan' : '/manageInterview/'+scope.row.id, query: { projectNo: id, from: 'list', matterStatus: scopePar.row.status }}" class="btn">进入</router-link>        <!-- 管理层访谈 -->
							    <router-link v-if="scope.row.workunitNo==4" :to="{ path: role ? '/partnersInterview/'+scope.row.id+'/partnersConfirmPlan' : '/partnersInterview/'+scope.row.id, query: { projectNo: id, from: 'list', matterStatus: scopePar.row.status }}" class="btn">进入</router-link>      <!-- 业务伙伴访谈 -->
							    <router-link v-if="scope.row.workunitNo==5" :to="{ path: role ? '/regulatoryInterview/'+scope.row.id+'/regulatoryConfirmPlan' : '/regulatoryInterview/'+scope.row.id, query: { projectNo: id, from: 'list', matterStatus: scopePar.row.status }}" class="btn">进入</router-link>    <!-- 监管部门访谈 -->
								<router-link v-if="scope.row.workunitNo==6" :to="{path: role ? '/netCheck/'+scope.row.id + '/auditData' : '/netCheck/'+scope.row.id, query: { projectNoDefault:id, workunitId: scope.row.id, from: 'list', matterStatus: scopePar.row.status }}" class="btn">进入</router-link>               <!-- 网络核查 -->
								<router-link v-if="scope.row.workunitNo==2" :to="{path:'/dueDiligence/createRepertoire/'+scope.row.id, query: {matterNo:scope.row.matterNo, projectNo: id,status: scopePar.row.status, from: 'list' }}" class="btn">进入</router-link>                                    <!-- 尽调文件收集与处理 -->
								<router-link v-if="scope.row.workunitNo==7" :to="{path:role?'/complianceCertification/confirmPlans/'+scope.row.id : '/complianceCertification/createPlans/'+scope.row.id,query:{projectNo:id,status: scopePar.row.status,from:'list'}}" class="btn">进入</router-link>                                     <!-- 合规证明 -->
								<router-link v-if="scope.row.workunitNo==8" :to="{path:role?'/workUnitInquiry/unitConfirm/'+scope.row.id:'/workUnitInquiry/unitCreate/'+scope.row.id,query:{projectNo:id,status: scopePar.row.status,from:'list'}}" class="btn">进入</router-link>                                              <!-- 询证 -->
								<router-link v-if="scope.row.workunitNo==1" :to="{path:role?'/inspectionPlan/checkPlan/'+scope.row.id : '/inspectionPlan/inspectionCreate/'+scope.row.id,query:{projectNo:id,status: scopePar.row.status,from:'list'}}" class="btn">进入</router-link>                                         <!-- 查验计划编制与实施 -->
								<router-link v-if="scope.row.workunitNo==9" :to="{path:role?'/selfDefine/checkFiles/'+scope.row.id : '/selfDefine/uploadFiles/'+scope.row.id,query:{name:scope.row.workunitName,status: scopePar.row.status,projectNo:id,from:'list'}}" class="btn">进入</router-link>                 <!-- 自定义 -->
								<!-- <div class="btn" v-else>进入</div> -->
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-table-column>
		<el-table-column align="center" width="200px"></el-table-column>
		<el-table-column align="center" prop="desc" label="项目名称" >
			<template slot-scope="scope">
				<div @click="expand(scope.row)" style="cursor: pointer;">
					<i style="font-weight: 600" :class="{'el-icon-arrow-down':!scope.row.expand,'el-icon-arrow-up':scope.row.expand}"></i>
					{{scope.row.desc}}
				</div>
			</template>
		</el-table-column>
		<el-table-column align="center" prop="status" label="状态" width="120px">
			<template slot-scope="scope">
				{{globalStatus.matterStatus[scope.row.status]}}
			</template>
		</el-table-column>
		<el-table-column align="center" prop="createTime" label="立项时间" width="170"></el-table-column>
		<el-table-column align="center" width="400px">
			<template slot-scope="scope">
				<template v-if="scope.row.workunitList.length>0">{{scope.row.workunitList[0].workunitName+'...更多'}}</template>
			</template>
		</el-table-column>
		<el-table-column label="操作"  align="center" width="140"></el-table-column>
	</el-table>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
	props: {
		id: '',
		matterName:'',
        getStatus:''
	},
	computed: {
		role(){
			if(this.$store.state.myWork.role.indexOf('Partnership') > -1 || this.$store.state.myWork.role.indexOf('Resp') > -1){
				return true
			}else{
				return false
			}
		},
		...mapState('myWork', ['matterList'])
	},
	data() {
		return {
			list: [],
			loading: false
		}
	},
	methods: {
        handleClick2(){
          alert('this')
		},
		getRowKeys(row){
        return row.id
    },
		rowClick(row,event,column){
				return row.id
		},
		//点击展开
		expand(row) {
			this.$refs.table.toggleRowExpansion(row)
		},
		//展开或者关闭的时候
		expandChange(row, expandedRows) {
			if (expandedRows.indexOf(row) > -1){
				row.expand = true
			}else {
				row.expand = false
			}
		},
		//获取事项信息
		getMatterInfo() {
			this.getMatterByProjectList(this.id).then(() => {
				this.list = this.matterList
				console.log(this.list)
				this.list.forEach(v => {
					v.expand = false
					v.workunitList.forEach(t=>{t.matterNo = v.matterNo,t.status=v.status})
				})
				let self = this;
				setTimeout(function(){
						if(self.matterName !=''){ //判断所有行是否展开
								self.list.forEach(v=>{
										self.$refs.table.toggleRowExpansion(v, true)
								})
						}else{
								self.list.forEach(v=>{
										self.$refs.table.toggleRowExpansion(v, false)
								})
						}
				},50)

			})

		},
        handleClick(val){
		    // alert('11111')
		},
		...mapActions('myWork', ['getMatterByProjectList'])
	},
	mounted() {
		this.getMatterInfo()
	}
}
</script>
