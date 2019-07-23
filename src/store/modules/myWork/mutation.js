export default{
	//设置案件列表
	setProject(state,list){
        state.projectList=list
    },
    setMatter(state,list){
    	state.matterList=list
    },
    setWorkunit(state,list){
    	state.workunit=list
    },
    //项目类型
    setProjectType(state,list){
        state.projectTypeList=list
    },
    //机构类型
    setOrganizationType(state,list){
        state.organizationTypeList=list
    },
    //人员列表
    setComplete(state,list){
        state.completeList=list
    },
    setchargeLawyerList(state,list){
        state.mychargeLawyerList=list
    },
    setexecLawyerList(state,list){
        state.myexecLawyerList=list
    },
    //保存律师在当前项目中的权限
    saveRole(state, role){
        state.role = role
    }
}