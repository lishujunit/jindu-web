/*邮箱验证*/
export function validateEmail(email) {
    const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    return re.test(email)
}

/*传真验证*/
export function validateFax(fax) {
    const re = /^(\d{3,4}-)?\d{7,8}$/
    return re.test(fax)
}

/*url验证*/
export function validateUrl(url) {
    const re =/^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/

    return re.test(url)
}

/*手机号验证*/
export function validatePhone(phone) {
  const re=/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-2,5-9])|(17[0-2,5-9]))\d{8}$/g
  return re.test(phone)
}


/*座机号验证*/
export function checkPhone(phone) {
  const re=/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
  return re.test(phone)
}

/* 底稿属性的验证 */
export function validationFormat(format){
  const re= /^[0-9]{1}[\d]*[.]{1}[\d]+([-]{1}[\d]+){0,2}$/
  return re.test(format)
}
/* 计划属性的验证 */
export function validationPlanFormat(format){
  const re= /^[0-9]{1}[\d]*([-]{1}[\d]+){2,4}$/
  return re.test(format)
}