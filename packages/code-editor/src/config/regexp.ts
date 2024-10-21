// 变量匹配正则 ${FORM.标题:title}
export const varRegexp = /\$\{(.+?)\}/g;

// 函数正则 func.xxx( sum(
export const funRegexp = /(func\.)?(\w+?)\(/g;
