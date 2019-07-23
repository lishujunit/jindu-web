<template>
    <div class="report-wrap">
        <div class="report-left" :class="{active:isActive}">
           <div class="left-first clearfix" :model="ruleForm" ref="ruleForm">
               <div class="flexbox">
                   <span>底稿属性</span>
                   <el-autocomplete class="search-input"
                        v-model="ruleForm.attribute"
                        clearable
                        @clear="clearPro()"
                        :fetch-suggestions="querySearchAsync"
                        @keyup.enter.native="handleSelect"
                        @select="handleSelect"
                   ></el-autocomplete>
               </div>
               <div class="flexbox" v-show="show">
                   <span>文件描述</span>
                   <el-autocomplete class="search-input"
                        v-model="ruleForm.fileName"
                        clearable
                        @clear="clearPro()"
                        :fetch-suggestions="querySearchAsync2"
                        @select="handleSelect_text"
                   ></el-autocomplete>
               </div>
               <div>
                   <el-checkbox v-show="show" v-model="ruleForm.hasQuestion" @change="hasQuestionChange">问题底稿</el-checkbox>
                   <!--<el-button @click="handleSearch" round size="mini">搜 索</el-button>-->
                   <el-button  round size="mini"  @click="pageChange(1)">搜 索</el-button>
                   <!--<span class="searchBtn" :class="{active:isActive}">搜索</span>-->
               </div>
           </div>
            <div class="left-second clearfix" :style="'max-height:'+contentHeight">
                <div class="left-item">
                    <p
                        v-for="(item,index) in itemList"
                        :key="item.matterNo"
                        :title="item.matterName"
                        :class="{active:cur==item.matterNo }"
                        @click="handleItemChange(item)"
                    >
                    {{item.matterName}}
                    </p>
                </div>
                <div class="left-content" :class="{active:isActive}">
                    <div class="table" :class="{active:isActive}">
                        <div class="left_ptitle">
                        	<p :title="content_matterName"><label class="left_ptitle_txt">{{content_matterName}}</label><span></span></p>
                        	<div class="left_ptitle_btnbox">
                        		<el-button class="confirm" v-show="userAuth&&userAuth=='Partnership'&&content_matterStatus!=2" type="primary" size="small" @click="manuscript_confirm()">确认</el-button>
                        		<el-button class="confirm" v-show="userAuth&&userAuth=='Partnership'&&content_matterStatus==2" type="primary" size="small" disabled>已确认</el-button>
                        	</div>
                        </div>
                        <el-table  style="width: 100%"
                        	:class="tableList.length==0?'marginTop1':'marginTop1 mytable'"
                        	ref="singleTable"
                        	:data="tableList" border
                        	:row-class-name="rowClass"
                        	highlight-current-row
                        	@current-change="handleCurrentChange"
                        	@row-click="rowClick"
                        	@select="selectRow"
                        	@selection-change="handleSelectionChange"
                        	@cell-mouse-enter="cellMouseEnter"
                        	>
                        		<el-table-column
							      type="selection">
							    </el-table-column>
								<el-table-column prop="manuscriptAttribute" label="报告序号" align="center">
									<template slot-scope="scope">
								        <el-popover trigger="hover" placement="top"  v-if="!show" >
								          <p>批注: {{ scope.row.annotationRemark!=""?scope.row.annotationRemark:'暂未批注' }}</p>
								          <div slot="reference" class="name-wrapper">
								            {{ scope.row.manuscriptAttribute }}
								          </div>
								        </el-popover>
								        <span v-else> {{ scope.row.manuscriptAttribute }}</span>
								   </template>
								</el-table-column>

								<el-table-column prop="fileName" label="文件描述">
									<template slot-scope="scope">
								        <el-popover trigger="hover" placement="top"  v-if="!show" >
								          <p>批注: {{ scope.row.annotationRemark!=""?scope.row.annotationRemark:'暂未批注' }}</p>
								          <div slot="reference" class="name-wrapper colorblue">
								            {{ scope.row.fileName }}
								          </div>
								        </el-popover>
								        <span v-else class="colorblue"> {{ scope.row.fileName }}</span>
								   </template>
								</el-table-column>
								<el-table-column v-if="show" prop="annotationUserName" label="确认人" align="center"></el-table-column>
								<el-table-column v-if="show" prop="annotationTime" label="确认时间" align="center"></el-table-column>
								<el-table-column v-if="show" prop="annotationRemark" label="批注" align="center"></el-table-column>
                        </el-table>
                        <page :total="total" :page="page" :expand="isActive" :page-total="pageTotal" :pageSize="pageSize" @pageChange="pageChange" @expandTable="expandTable"></page>
                    </div>
                    <div class="collapse-btn" @click="handleCollapse" :class="{active:isActive}"></div>
                </div>
            </div>
        </div>
        <div class="report-right" :class="{active:isActive}">
            <div class="right-title">
                <span @click="closeUrl" v-show="imgPath">x</span>
                <el-button @click="handleOpenDialog" style="margin-top: -2px;" round size="mini" v-show="userAuth&&userAuth=='Partnership'&&content_matterStatus!=2">批注</el-button>
            </div>
            <div class="right-content" :class="{active:isActive}" :style="'height:'+contentHeight">
                <!--<div>-->
                	<!--<img :src="imgPath" alt="" width="100%" />-->
                    <iframe id="preview" :src="imgPath" frameborder="0" width="100%" name="previewFile" scrolling="auto"></iframe>
                <!--</div>-->
            </div>
        </div>
        <common-dialog  :options="options"></common-dialog>
       <!--<div class="mytootipbox" :style="'left:'+mytootipbox_l+'px;top:'+mytootipbox_t+'px'">111111</div>-->
    </div>
</template>

<script>
    import commonDialog from '@/components/commonDialog/commonDialog'
    import page from '@/components/customPage/page'
    import { getManuscriptByProjectNo,getManusListByMatterNo,manuscript_confirm,remarkManuscript,authApi,getMatterAttributes,getMatterNames } from '@/api/mywork'
    export default {
        name: "reportIndex",
        components:{
            commonDialog,
            page
        },
        data(){
            return{
            	mytootipbox_l:0,
            	mytootipbox_t:0,
            	//搜索框
            	ruleForm: {
	                attribute: '',//底稿属性
	                fileName: '',//文件描述
	                hasQuestion:false,//含有问题  true有问题 false无问题
	            },
            	imgPath:'',
            	currentRow: null,
            	multipleSelection: [],//报告底稿列表已选择列表
            	name:'',
            	//批注弹窗参数
                options:{
                    dialogFormVisible:false,
                    handleClose:this.handleClose,
                    reasonInput:'',
                    moreShow:false,
                    title:'批注',
                    handleMoreCommit:this.handleMoreCommit,
                    handleCommit:this.handleCommit,
                },
				tableList: [
					 {
				        "annotationRemark": "",
				        "annotationTime": "",
				        "annotationUserName": "",
				        "busId": "",
				        "createTime": "",
				        "fileName": "",
				        "filePath": "",
				        "flaged": 0,
				        "id": "",
				        "manuscriptAttribute": "",
				        "matterNo": ""
				   }
				],
                content_matterName:'',
                content_matterStatus:1,
                itemList:[
                    {
						createTime:"",
		   				createUser:"",
						delFlag:"",
						description:"",
						id:"",
						matterName:"",
						matterNo:"",
						orderNo:0,
						projectNo:"",
						status:1,
						updateTime:"",
						updateUser:"",
					}
                ],
                contentHeight:'',
                state4:'',
                cur:0,
                page: 1,//当前页数
				total: 0,//数据总条数
				pageTotal: 0,//总页数
	            pageSize:20,//每页条数
                isActive:true,
                show:false,
                rowId:'',
                userAuth:'',//角色

            }
        },
        created(){
            window.addEventListener('resize', this.getHeight);
            this.getHeight()
        },
        destroyed(){
            window.removeEventListener('resize', this.getHeight)
        },
        mounted(){
            this.getHeight();
           	let self=this;
           	if(this.$route.query.materId) this.cur=this.$route.query.materId;
           		 //获取案件下面的所有事项
	            this.getTabList(function(res){
	            	if(res.length!=0){
	            		res.forEach(v=>{
	              			if(self.$route.query.materId==v.matterNo){
		            			self.content_matterName=v.matterName;
		            			self.content_matterStatus=v.status;
	 							if(self.$route.query.materId) self.cur=self.$route.query.materId
//		            			//获取事项下面的所有底稿
//		            			let manuscriptOptions={
//		            				matterNo:v.matterNo,
//		            				pagenum:self.page,
//		            				pagesize:self.pagesize
//		            			}
//		            			self.getMatterList(manuscriptOptions)
	              			}
	            		})
	            	}

	            });
            this.pageChange(1);
            this.getAuth()

        },
        methods:{
        	cellMouseEnter(row, column, cell, event){
//      		console.log(column)
//      		this.mytootipbox_l=event.x
//      		this.mytootipbox_t=event.y
        	},
        	//律师权限
            getAuth(){
                let vm = this;
                const projectNo=vm.$route.params.id;
                authApi(projectNo).then((res)=>{
                    if (res.code == 0){
                        vm.userAuth = res.result;
//                      console.log(vm.userAuth)
                    }
                })
            },
        	//关闭右侧
        	closeUrl(){
        		this.imgPath='';
        		this.$refs.singleTable.setCurrentRow();
        	},
        	//问题底稿复选框内容改变时
        	hasQuestionChange(val){
        		this.ruleForm.hasQuestion=val;
        		this.pageChange(1)
        	},
        	//清除搜索框内容
        	clearPro(item){
	        	this.pageChange(1)
	        },
        	//获取案件下面的所有事项
        	getTabList(callback) {
				const projectNo=this.$route.params.id;
				let that=this;
				getManuscriptByProjectNo(projectNo).then((res)=>{

					if(res.code==0){
						that.itemList=res.result;
						that.content_matterName=that.itemList[0].matterName;
						that.content_matterStatus=that.itemList[0].status;
						that.cur=that.itemList[0].matterNo;
						callback&&callback(res.result)
					}
				}).catch(()=>{

				})
			},
			//获取事项下面的所有底稿   *表示必填项
			getMatterList(options){
				var defaultoptions={
					attribute:this.ruleForm.attribute,//底稿属性
					fileName:this.ruleForm.fileName,//文件描述
					hasQuestion:this.ruleForm.hasQuestion?1:"",//含有问题  1 有问题  0 无问题
					matterNo:options.matterNo?options.matterNo:"",//事项号  *
					pagenum:options.page?options.page:this.page,//当前页码 *
					pagesize:options.pageSize?options.pageSize:this.pageSize,//每页多少条数据 *

				}
//				defaultoptions=options?options:defaultoptions;
				//获取事项下的所有底稿
				const that=this;
				getManusListByMatterNo(defaultoptions).then((res)=>{

					if(res.code==0){
//						console.log(res)
						that.tableList=res.result.records;
						that.total=Number(res.result.total);//数据总条数
						that.pageSize=res.result.size;//每页条数
						that.pageTotal=Number(res.result.pages);//总页数
						that.page=res.result.current;//当前页数
					}
				}).catch(()=>{

				})
			},
			//大律师确认  matterNo
			manuscript_confirm(){
				const self=this;
				manuscript_confirm({matterNo:this.cur}).then((res)=>{
					if(res.code==0){
						this.$message({
									type: 'success',
									message: res.msg
								});
						//确认完毕后需要修改状态值
		            	self.content_matterStatus=2;
					}
				}).catch(()=>{

				})
			},
        	//底稿属性
            handleSelect(val){
				this.ruleForm.attribute=val.value;
				this.pageChange(1)
            },
        	//文件描述
			handleSelect_text(val){
				this.ruleForm.fileName=val.value;
				this.pageChange(1)
			},
            //底稿属性模糊查询
            querySearchAsync(queryString, cb) {
//          	const restaurants=[];
//          	this.tableList.forEach(v=>{
//          		restaurants.push({
//          			value:v.manuscriptAttribute
//          		})
//          	})
//              var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
//
//              clearTimeout(this.timeout);
//              this.timeout = setTimeout(() => {
//                  cb(results);
//              }, 3000 * Math.random());
				let opt={
					attribute:this.ruleForm.attribute,
					matterNo:this.cur
				};
				 getMatterAttributes(opt).then(res => {
	                let selectList=[]
	                if(res.code==0){
	                	selectList=res.result
	                    res.result.forEach(v=>{
	                        selectList.push({value:v})
	                    })
	                }
	                var results = queryString ? selectList.filter(this.createStateFilter(queryString)) : selectList;
	                cb(results);

	            }).catch(error => {});
            },
             querySearchAsync2(queryString, cb) {
//          	const restaurants=[];
//          	this.tableList.forEach(v=>{
//          		restaurants.push({
//          			value:v.fileName
//          		})
//          	});
//              var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
//
//              clearTimeout(this.timeout);
//              this.timeout = setTimeout(() => {
//                  cb(results);
//              }, 3000 * Math.random());
				let opt={
					fileName:this.ruleForm.fileName,
					matterNo:this.cur
				};
				 getMatterNames(opt).then(res => {
	                let selectList=[]
	                if(res.code==0){
	                	selectList=res.result
	                    res.result.forEach(v=>{
	                        selectList.push({value:v})
	                    })
	                }
	                var results = queryString ? selectList.filter(this.createStateFilter(queryString)) : selectList;
	                cb(results);

	            }).catch(error => {});
            },
             createStateFilter(queryString) {
	            return (state) => {
	                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
	            }
	        },

            getHeight(){
                this.contentHeight=window.innerHeight-200+'px';
            },
            //左侧切换列表
            handleItemChange(item){
//          	console.log(item)
                let vm = this;
                vm.cur = item.matterNo
                //更新右侧title事项名称
                vm.content_matterName=item.matterName;
                vm.content_matterStatus=item.status;
                this.imgPath=''
//              this.$refs.ruleForm.resetFields();
				this.ruleForm={
	                attribute: '',//底稿属性
	                fileName: '',//文件描述
	                hasQuestion:false,//含有问题  true有问题 false无问题
	           };
                let manuscriptOptions={
    				matterNo:vm.cur,
    				page:1,
    				pagesize:vm.pageSize
    			}
    			vm.getMatterList(manuscriptOptions)
            },

            //列表展开与缩放按钮
            handleCollapse(){
                this.isActive = !this.isActive
                this.show = !this.show
            },
            expandTable(isActive) {
//				this.isActive =isActive
				this.isActive = !this.isActive
				this.show = !this.show
			},
			pageChange(index,callback) {
	            this.page = index;
//				console.log(this.page)
    			//获取事项下面的所有底稿
    			let manuscriptOptions={
    				attribute:this.ruleForm.attribute,//底稿属性
					fileName:this.ruleForm.fileName,//文件描述
					hasQuestion:this.ruleForm.hasQuestion?1:"",//含有问题  1 有问题  0 无问题
					matterNo:this.cur,//事项号  *
					page:this.page,//当前页码 *
					pagesize:this.pageSize,//每页多少条数据 *
    			}
    			this.getMatterList(manuscriptOptions)
    			callback&&callback()
        	},
            handleClick(){

            },
            //批注按钮
            handleOpenDialog(){
            	//多行批注multipleSelection
            	if(this.multipleSelection.length==0){
            		 this.$alert("请选择要批注的项！", "提示", {
                        type: "warning",
                        confirmButtonText: "确定",
                        callback: () => {}
                     });
//          		this.popSuccess('warning','请至少选择一条需要批注的底稿文件！')
            	}else{
            		//显示批注弹窗
					this.options.dialogFormVisible=true;
            	}
            },
            //表格多选事件
            handleSelectionChange(val){
			 this.multipleSelection = val;
			},
			selectRow(selection, row){
//				console.log(selection)
//				console.log(row)
//				console.log(this.multipleSelection)
			},
            //选中行
            rowClick(val){
            	//设置当前行高亮
            	this.$refs.singleTable.setCurrentRow(val);
                this.rowId = val.id;
                //更新右侧链接、
                this.imgPath =  process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url='+ encodeURIComponent(val.filePath);
            },
            handleCurrentChange(val) {
		        this.currentRow = val;
		      },
            handleClose(){
                this.options.dialogFormVisible = false
                this.options.reasonInput = ''
            },
            //提交确认--多个
            handleMoreCommit(){
//          	alert('2')
            },
            setCurrent(row) {
                this.$refs.singleTable.setCurrentRow(row);
            },
            //提交确认--单个
            handleCommit(){
                if (this.options.reasonInput.trim() == ''){
                    this.popSuccess('warning','输入不能为空！')
                }else{
                	const ids=[];
                	//修改选择的批注
                	this.multipleSelection.forEach(v=>{
						//标记有问题的底稿
						ids.push(v.id)

					});
                	var opt={
							flag:1,
							ids:ids,
							remark:this.options.reasonInput
						};
						this.getRemarkManuscript(opt)
                    this.handleClose()
                }
            },
            //标记后加背景颜色
            rowClass({ row, rowIndex}) {
                 let vm = this;
                if (row.flaged ===1) {
                    if (rowIndex ===0){
                        return 'red'
                    }else{
                        return 'red'
                    }
                }else{
                    return ''
                }
            },
            //标记有问题的底稿
            getRemarkManuscript(opt){
//          	console.log(opt)
//          	const opt={
//          		flag:opt.flag,//是否有问题 *
//          		id:opt.id,//底稿id *
//          		remark:opt.remark,//批注内容 *
//          	}
				const vm=this;
            	remarkManuscript(opt).then((res)=>{
					if(res.code==0){
						vm.pageChange(1)

					}
				}).catch(()=>{

				})
            },
            popSuccess(type,message){
		          this.$message({
		              type:type,
		              message:message
		          })
		    },
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
	.el-popover{
    	width: auto !important;
    }
    .report-wrap .el-table tr.red{
        background: #FFC !important;

    }
    .report-wrap{
    	/*.el-table--small td{
        	padding: 0px;
        }
        .el-table td .cell{
        	padding: 0px;
        }
       .el-table .el-table-column--selection .cell{
        	padding-left:10px;
        	padding-right: 14px;
        }
        .el-table td  span{
        	padding: 10px;
        }*/
    }
     .mytable{
    	border-right: 1px solid #d1dfe3;
    	/*border-bottom: 1px solid #d1dfe3;*/
    	.el-table__body-wrapper{
    		/*overflow-x: hidden !important;*/
    		
    	}
    	/*.el-table__body{
    		width: 270px !important;
    	}*/
    }
    .report-wrap .report-left .left-first > div{
    	.el-checkbox__label{
						font-size: 12px;
					}
    }
    
</style>
<style rel="stylesheet/scss" lang="scss"  scoped>
    @import "@/assets/css/varibles.scss";
    .colorblue{
    	color:#0cb3f0;
    }
    .mytootipbox{
    	position: fixed;
	    background: #FFFFFF;
	    min-width: 100px;
	    border-radius: 4px;
	    border: 1px solid #EBEEF5;
	    padding:10px;
	    z-index: 2000;
	    color: #606266;
	    line-height: 1.4;
	    text-align: justify;
	    /*font-size: 14px;*/
	    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	    word-break: break-all;


    }
    .mytootipbox:after{
	    	 position:absolute;
	    	content:'';
	    	display:block;
	    	left:50%;
	    	bottom:-8px;
	    	margin-left: -5px;
			width:0;
			height:0;
			border-left:8px solid transparent;
			border-right:8px solid transparent;
			border-top:8px solid #fff;

	    }
    .marginTop1{
    	margin-top: 1px !important;
    }
    .mytable{
    	/*border-left: 1px solid #d1dfe3;*/
    	.el-table__body-wrapper{
    		overflow-x: hidden !important;
    	}
    }

    .report-wrap{
        /*margin-top: 20px;*/
        height: 48px;
        width: 100%;
        margin: 0 auto;
        background: #cfdbe3;
        border: 1px solid #d0dee3;
        color: #666666;
        box-sizing: border-box;
        line-height: 48px;

        .left_ptitle{
        	/*font-size: 16px;*/
        	display: flex;
        	display: -webkit-flex; /* Safari */
        	align-items:center;
        	>p{
        		/*flex: 1;*/
        		display: flex;
        		display: -webkit-flex; /* Safari */
        		padding-right: 5px;
        		.left_ptitle_txt{
        			flex: 1;
        			white-space: nowrap;
	        		overflow: hidden;
	        		text-overflow: ellipsis;
        		}
        	}
        	.left_ptitle_btnbox{
        		flex: 1;
        		.confirm {
					padding: 6px 15px;
					height: 30px;
					float: right;
				}
        	}

        }
        .report-left{
            float: left;
            box-sizing: border-box;
            border-right: 1px solid #c7d5da;
            /*width: 570px;*/
            width:60%;
            padding-right: 1px;
            box-sizing: border-box;
            .left-first{
                /*width: 570px;*/
                display: flex;
                box-sizing: border-box;
                padding-left: 18px;
                /*font-size: 14px;*/
               	.flexbox{
               		flex: 1;
               		display: flex;
               		/*justify-content: center;*/
                   	align-items: center;
                   	padding-right: 0px;
                   	.el-input{
                   		width: 96%;
                   	}
               	}
                >div{
		
                    float: left;
                    /*flex-direction: column;*/

                   	padding-right: 10px;
                    .search-input{
                        width: 65%;
                        /*min-width: 100px;*/
                    }
                    >span{
                        margin-right: 10px;
                    }
                    .searchBtn{
                        background: #fff;
                        padding: 5px 19px;
                        border-radius: 18px;
                        cursor: pointer;
                        width: 100px;

                    }
                    .el-input {
                        width: 80px;
                        height: 24px;
                        border: 1px solid #d0dee3;
                        .el-input--small{
                            height: 24px;
                            line-height: 24px;
                        }
                    }
					.el-button{
						height: 30px;
						/*font-size: 14px;*/
					}
					
                }
            }
            &.active{
                width: 450px;
                .left-first{
                	>div{
	                	.search-input{
	                        /*width: 115px;*/
	                        /*float: left;*/
	                    }
                	}
                }
            }
            .left-second{
                margin-top: -2px;
                display: flex;
                overflow-x: hidden;
                overflow-y: auto;
                .left-item{
                    min-width: 100px;
                    max-width: 160px;
                     overflow-x: hidden;
                overflow-y: auto;
                   	 /*border-bottom: 1px solid #d0dee3;*/
                    >p{
                    	white-space: nowrap;
		        		overflow: hidden;
		        		text-overflow: ellipsis;
	                    box-sizing: border-box;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        padding: 0 10px;
                        border: 1px solid #d0dee3;
                        font-size: 12px;
                        color: $txt-color;
                        &.active{
                            border-right: none;
                            background: #fff;
                            color: #0cb3f0;
                        }
                    }
                }
                .left-content{
                	height: 100%;
                    /*width: 489px;*/
                    /*width:calc(100% - 130px);*/
                   flex: 1;
                    /*float: right;*/
                    box-sizing: border-box;
                    border: 1px solid #d0dee3;
                    border-right: none;
                    background: #fff;
                    padding-left: 20px;
                    padding-bottom: 20px;
                    position: relative;
                    overflow: hidden;
                    &.active{
                        /*width:calc(100% - 120px);*/
                    }
                    >p{
                        font-size: 12px;
                        color: #5e6572;
                    }
                    .table{
                        float: left;
                        /*width: 450px;*/
                        width:calc(100% - 15px);
                        &.active{
                            /*width: 260px;*/
                        }
                        table{
                            width: 100%;
                            color: #5e6572;
                            font-size: 12px;
                            tr,td,th{
                                /*border: 1px solid #d0dee3;*/
                                padding-left: 19px;
                                line-height: 30px;
                            }
                            .file-descripe{
                                color: $global-color;
                            }

                        }
                        .footer{
                            display: flex;
                            margin: 0 20px;
                            >div:nth-of-type(2){
                                /*flex: 1;*/
                                text-align: center;
                                flex-direction: column;
                                position: relative;
                                >div{
                                    width: 340px;
                                    text-align: center;
                                    &.active{
                                        width: 80px;
                                        .preve-page{
                                            left: 18%;
                                        }
                                        .next-page{
                                            left: 70%;
                                        }
                                    }
                                }
                                .preve-page{
                                    width:0;
                                    height:0;
                                    float: left;
                                    position: absolute;
                                    left: 40%;
                                    top: 18px;
                                    border-top:8px solid transparent;
                                    border-bottom:8px solid transparent;
                                    border-right:10px solid #5e6572;

                                }
                                .next-page{
                                    width:0;
                                    height:0;
                                    float: right;
                                    position: absolute;
                                    left: 56%;
                                    top: 18px;
                                    border-top:8px solid transparent;
                                    border-bottom:8px solid transparent;
                                    border-left:10px solid #5e6572;

                                }
                            }
                            >div:last-of-type{
                                text-align: right;
                                color: $global-color;
                                text-decoration: underline;
                                cursor: pointer;
                            }
                        }
                    }
                    .collapse-btn{
                        float: right;
                        position: absolute;
                        bottom: 0;
                        top: 50% ;
                        cursor: pointer;
                        width:0;
                        right: 2px;
                        height:0;
                        border-top:8px solid transparent;
                        border-bottom:8px solid transparent;
                        border-right:10px solid #5e6572;
                        margin-top: -4px;
                        &.active{
                            border-right:none;
                            border-left:10px solid #5e6572;
                        }
                    }
                }
            }
        }
        .report-right{
            float: right;
            /*width: calc(100% - 570px);*/
            width:40%;
            box-sizing: border-box;
            &.active{
                width: calc(100% - 450px);
            }
            .right-title{
                /*margin-top: -2px;*/
               display: flex;
               align-items:center;
               height: 51px;
               padding-left: 10px;
                >span{
                    margin: 0 15px;
                    color: #868889;
                    font-size: 22px;
                    cursor: pointer;
                    margin-left: 10px;

                }
                .el-button{
                	/*font-size: 14px;*/
                	height: 30px;
                }
                /*>span:last-of-type{*/
                    /*color: #5e6572;*/
                    /*font-size: 14px;*/
                    /*background: #fff;*/
                    /*padding: 6px 17px 3px 17px;*/
                    /*border-radius: 20px;*/
                    /*cursor: pointer;*/
                /*}*/
            }
            .right-content{
                min-height: 456px;
                float: right;
                width: 100%;
                text-align: center;
                padding: 20px;
                margin-top: -4px;
                box-sizing: border-box;
                background: #fff;
                border: 1px solid #d0dee3;
                &.active{
                    /*width: calc(100% - 326px);*/
                }
                >div{
                    height: 100%;
                    overflow-y: scroll;
                }
            }
        }
    }
</style>
