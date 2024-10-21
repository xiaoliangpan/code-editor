export function deepClone(obj, hash = new WeakMap()) {
  // 处理 null、undefined、非对象类型的情况，直接返回原值
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 处理循环引用的情况，避免递归进入死循环
  if (hash.has(obj)) {
    return hash.get(obj);
  }

  // 判断对象是数组还是普通对象，并创建对应的克隆
  let cloneObj = Array.isArray(obj) ? [] : {};

  // 将当前对象存储到 hash 中，以防循环引用
  hash.set(obj, cloneObj);

  // 遍历对象的属性
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 递归调用 deepClone 处理对象内的嵌套对象
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }

  return cloneObj;
}

export const getFuncId = (name: string, functions) => {
  return functions?.find?.((item) => item?.label === name)?.id;
};
