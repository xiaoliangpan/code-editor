// 变量插入规则 是否加 ','
export function insertInputIntoFunction(code, pos, input) {
  function hasCommaBefore(code: string, position: number) {
    let index = position - 1; // 从目标位置的前一个字符开始检查

    // 向后遍历，直到找到一个非空字符或到达字符串开头
    while (index >= 0 && code[index] === " ") {
      index--; // 跳过空格
    }

    // 检查是否已经找到字符，并判断是否为逗号
    return index >= 0 && code[index] === ",";
  }
  function hasCommaAfter(code: string, position: number) {
    let index = position + 1; // 从目标位置的前一个字符开始检查
    console.log("hasCommaAfter", code[position], "index", code[index]);
    // 向后遍历，直到找到一个非空字符或到达字符串开头
    while (index < code.length - 1 && code[index] === " ") {
      index++; // 跳过空格
    }

    // 检查是否已经找到字符，并判断是否为逗号
    return index < code.length - 1 && code[index] === ",";
  }
  // 匹配函数调用的正则表达式：匹配函数名和括号中的参数
  const funcRegex = /([a-zA-Z_$][\w$]*)\s*\(([^)]*)\)/g;
  let match;
  let updatedCode = input;
  let foundInsertPosition = false;

  // 遍历匹配的函数
  // eslint-disable-next-line no-cond-assign
  while ((match = funcRegex.exec(code)) !== null) {
    // console.log("match1", match);
    const funcStart = match.index; // 函数匹配的起始位置
    const openParenIndex = code.indexOf("(", funcStart); // '(' 的位置
    const closeParenIndex = code.indexOf(")", openParenIndex); // ')' 的位置
    // console.log("match11", pos, openParenIndex, closeParenIndex);
    // 检查插入位置是否在函数的括号内
    if (pos >= openParenIndex && pos <= closeParenIndex) {
      // console.log("match2", match);
      const insideArgs = match[2]; // 获取括号内的参数
      const argStart = openParenIndex + 1; // 参数开始的索引位置
      let cumulativeIndex = argStart;
      let insertCommaBefore = false; // 是否需要在前面插入逗号
      let insertCommaAfter = false; // 是否需要在后面插入逗号

      // 根据逗号分割参数，去除多余的空格
      const args = insideArgs.split(",").map((arg) => arg.trim());

      // 遍历参数，检查插入位置前后是否有参数
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const argEnd = cumulativeIndex + arg.length;

        // 如果光标在当前参数之前，表示在括号中的第一个位置
        if (pos < cumulativeIndex && code[cumulativeIndex] !== ")") {
          insertCommaBefore = false; // 没有前面的参数，不需要逗号
          insertCommaAfter = true; // 但后面有参数，需要插入逗号
          foundInsertPosition = true;

          break;
        }
        // 如果光标在当前参数之后
        else if (pos > argEnd) {
          // 在参数之后插入，前面有参数，可能需要插入逗号
          insertCommaBefore = true;
        }

        // 更新累积索引，移动到下一个参数
        cumulativeIndex = argEnd + 1;
      }

      // 检查插入点前后的字符

      const beforeChar = hasCommaBefore(code, pos);

      const afterChar = hasCommaAfter(code, pos);
      console.log("beforechar", beforeChar, "afterchar", afterChar);
      // 如果插入点前已经有逗号，则不需要再插入逗号
      if (beforeChar) {
        insertCommaBefore = false;
      }

      // 如果插入点后已经有逗号，则不需要再插入逗号
      if (afterChar) {
        insertCommaAfter = false;
      }
      // console.log(
      //   "insertcommabefore",
      //   insertCommaBefore,
      //   "insertcommaafter",
      //   insertCommaAfter,
      //   "beforChar",
      //   beforeChar,
      //   "afterChar",
      //   afterChar
      // );
      // 生成插入的代码，根据是否需要前后逗号决定格式
      // const before = code.slice(0, pos);
      // const after = code.slice(pos);

      const before = code?.[pos - 1] === " " ? "" : " ";
      const after = code?.[pos] === " " ? "" : " ";
      const beforeComma = hasCommaBefore(code, pos);
      const afterComma = hasCommaAfter(code, pos);
      if (insertCommaBefore && insertCommaAfter) {
        // 前后都需要逗号，插入 `, input,`
        // updatedCode = before + `, ${input}, ` + after;
        updatedCode = `, ${input},`;
      } else if (insertCommaBefore) {
        // 只在前面插入逗号，插入 `, input`
        // updatedCode = before + `, ${input}` + after;
        updatedCode = `, ${input}`;
      } else if (insertCommaAfter) {
        // 只在后面插入逗号，插入 `input,`
        // updatedCode = before + `${input}, ` + after;
        updatedCode = ` ${input},`;
      } else {
        // 两边都不需要逗号，直接插入 `input`
        // updatedCode = before + `${input}` + after;
        updatedCode = before + input + after;
      }

      foundInsertPosition = true;
      break; // 已找到插入点，退出循环
    }
  }

  // 如果没有在括号中找到插入位置，直接插入 input
  if (!foundInsertPosition) {
    const before = code?.[pos - 1] === " " ? "" : " ";
    const after = code?.[pos] === " " ? "" : " ";

    // updatedCode = before + input + after;
    updatedCode = before + input + after;
  }

  return updatedCode;
}

/*
移除input注释内容
@ param input 输入字符串 如：CONCAT(${SYS1|登录信息:a.地址:b.的:c.bb:d})
@ return 转换后的字符串 如：CONCAT(${SYS1|a.b.c.d})
*/
export function removeCommentsText(input: string) {
  if (input.indexOf(":") === -1) return input;
  return input.replace(/\${[^|]+\|[^}]+}/g, (match) => {
    // 提取 "|" 之后的部分，格式如: ${SYS|登录信息:a.地址:b.的:c}
    const parts = match
      .split("|")[1] // 获取 "|" 后面的部分
      .replace("}", "") // 去掉 "}"
      .split(/[:.]/); // 按 ":" 和 "." 分割成数组

    // 过滤掉无效的字段，只保留冒号 ":" 和点 "." 后的部分
    const filteredParts = parts.filter((part, index) => index % 2 !== 0);

    // 将剩下的部分用 "." 连接
    const result = match.split("|")[0] + "|" + filteredParts.join(".") + "}";
    return result;
  });
}

/**
 * 格式化注释内容
 * @param input SYS|a.b.c
 * @param keyToNameMap {a:登录信息,b:地址,c:的}
 * @description 格式化注释内容，将 SYS|a.b.c 格式转换为 SYS|登录信息:a.地址:b.的:c
 * @returns  SYS|登录信息:a.地址:b.的:c
 */
export function formatCommentsText(
  input: string,
  keyToNameMap: Record<string, string>
) {
  // 匹配 ${任意字符串|...} 中间的内容
  return input.replace(
    /([a-zA-Z0-9]+)\|([a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+)/g,
    (match, system, group) => {
      // 将 'curOrg.orgId' 拆分为 ['curOrg', 'orgId']

      const keys = group.split(".");

      // 用字典 b 进行转换
      const formattedKeys = keys.map((key) => {
        if (keyToNameMap?.[key]) {
          return `${keyToNameMap[key]}:${key}`; // 构造 'value:key' 格式
        }
        console.log(`${key} 未在字典中`);
        return `未解析:${key}`; // 如果字典中没有该键，则保持不变
      });

      // 将转换后的内容重新组合并插入到 ${任意字符串|...} 中
      return `${system}|${formattedKeys.join(".")}`;
    }
  );
}
/**
 * 判断是 "${SYS.登录信息:LOGIN_INFO.地址:pAddr}" 这种格式数据
 * @param str
 * @returns  boolean
 */
export function isValidFormat(str) {
  // 正则表达式匹配格式 ${前缀.键值对}
  return str?.indexOf(":") !== -1 && str.indexOf("|") !== -1;
}
