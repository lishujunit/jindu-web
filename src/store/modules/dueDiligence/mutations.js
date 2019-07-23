import { stat } from "fs";

export default{
  setUserRole(state,str){
    state.userRole = str
  },
  setColBtn(state,btnBool){
    state.colAboutBtn = btnBool
  },
  setRowBtn(state,btnBool){
    state.rowAboutBtn = btnBool
  },
  setOnlyReadHeader(state,btnBool){
    state.onlyReadHeader = btnBool
  },
  setOnlyReadContent(state,btnBool){
    state.onlyReadContent = btnBool
  },
  setUploadJumpIn(state,btnBool){
    state.uploadJumpIn = btnBool
  },
  setUnqualifiedArr(state,arr){
    state.unqualifiedArr = []
    state.unqualifiedArr = [...arr]
  },
  setAttachmentName(state,val){
    state.attachmentName = val
  },
  setThisDueId(state,val){
    state.thisDueId = val
  },
  setContentName(state,val){
    state.contentName = val
  },
  setAttachmentId(state,val){
    state.attachmentId = val
  },
  setLoginStatus(state,stateBool){
    state.loginStatus = stateBool
  },
  setTabViewBtn(state,btnBool){
    state.tabViewBtn = btnBool
  },
  setTabViewBtnStatus(state,btnBool){
    state.tabViewBtnStatus = btnBool
  },
  setCompanyAboutData(state,obj){
    state.companyAboutData = obj
  },
  setEncryptionBool(state,btnBool){
    state.encryptionBool = btnBool
  },
  setCompanyIdStr(state,str){
    state.companyIdStr = str
  },
  setEightJumpIn(state,bool){
    state.eightJumpIn = bool
  },
  setTwoJumpIn(state,bool){
    state.twoJumpIn = bool
  },
}
