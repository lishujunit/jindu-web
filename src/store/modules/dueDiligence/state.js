export default{
  userRole:'',//权限获取，即每个页面的进入权限
  colAboutBtn:false,//附件表是否有保存按钮的页面及添加列功能
  rowAboutBtn:false,//附件表是否有添加行功能、多选、加密按钮和操作这一列的操作功能
  onlyReadHeader:false,//第二及第四步附件只读属性
  onlyReadContent:false,//第四步以后的附件只读属性
  uploadJumpIn:false,//是否从上传附件页面进入附件显示更多东西
  unqualifiedArr:[],//附件里需要标红的数组,即附件里的不合格文件的数组
  attachmentName:'',//附件名称
  thisDueId:'',//点的哪行尽调属性ID
  contentName:'',//附件表头名字
  attachmentId:'',//附件ID
  loginStatus:false,//登录状态，客户登录的第三部和第五步的调试
  tabViewBtn:false,//页面顶部是否有切换视图的按钮
  tabViewBtnStatus:true,//切换视图的状态判断是哪个视图 true是客户资料，false是尽调清单
  companyAboutData:{id:''},//当前公司的相关数据
  encryptionBool:false,//附件里上传是否有加密，默认不加密
  companyIdStr:'',//公司id
  eightJumpIn:false,//是否是第八步进入的附件
  twoJumpIn:false,//是否是第二步进入的附件
}