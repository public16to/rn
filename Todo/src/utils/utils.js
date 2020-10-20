// 判断是否是手机号
export function checkPhone(mobile) {
  let phone = mobile;
  if (!/^1[3456789]\d{9}$/.test(phone)) {
    return false;
  } else {
    return true;
  }
}
