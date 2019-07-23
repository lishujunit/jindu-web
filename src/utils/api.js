import { removeToken } from '@/utils/auth'
import { MessageBox } from 'element-ui'

/*退出*/
export function logOut() {
    removeToken()
    setTimeout(() => {
        location.reload();
    }, 500)
}

/*数字格式化*/
export function numberFormat(number, decimals, dec_point, thousands_sep) {
    /*
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.ceil(n * k) / k;
        };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

/*时间格式化方法*/
export function dateFtt(fmt, date) { //author: meizz
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/*格式化内容*/
export function conentFormat(content){
    return content.replace(/\n/gm,"<br>");
}

/*下载文件*/
export function downFile(res,name) {
    var blob = new Blob([res])
    var downloadElement = document.createElement('a');
    var href = window.URL.createObjectURL(blob); //创建下载的链接
    downloadElement.href = href;
    downloadElement.download = name; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(href); //释放掉blob对象
}

// /*文件预览*/
// export function previewFile(fileUrl, fileType) {
//   let format = fileUrl.slice(fileUrl.lastIndexOf(".")).toLowerCase();
//   var url = '';
//   var winHeight = window.document.documentElement.clientHeight-10;
//   if(format == '.m4a'){
//     url = fileUrl;
//   }else{
//     url = process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url=' + encodeURIComponent(fileUrl);
//   }
//   window.open(url, "_blank", "height=" + winHeight
//         + ",top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes");
// }
/*文件预览*/
export function previewFile(fileUrl,title) {
  let format = fileUrl.slice(fileUrl.lastIndexOf(".")).toLowerCase();
  var url = '';
  var winHeight = window.document.documentElement.clientHeight-10;
  if(format == '.m4a'){
    url = fileUrl;
  }else{
      if (title){
          url = process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url=' + encodeURIComponent(fileUrl)+'&title='+title;
      } else{
          url = process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url=' + encodeURIComponent(fileUrl);
      }
    // url = process.env.VUE_APP_PREVIEWURL+'/preview/onlinePreview?url=' + encodeURIComponent(fileUrl)+title;
  }
  window.open(url, "_blank", "height=" + winHeight
        + ",top=80,left=80,toolbar=no, menubar=no, scrollbars=yes, resizable=yes");
}

