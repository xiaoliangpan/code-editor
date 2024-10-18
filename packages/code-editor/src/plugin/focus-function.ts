import { cssConfig } from "../config";
import { FunctionType } from "../interface";

export function focusFunction(
  event: MouseEvent,
  functionsMap: Record<string, FunctionType>,
  onFocusFunc
) {
  if (event.buttons === 1) {
    const element = event.target as Element;
    // 检查点击的元素是否包含 funcName 类
    if (element?.classList?.contains(cssConfig.funcNameClass)) {
      const funcName = element.getAttribute("data-func-name");
      if (funcName) {
        const funcData = functionsMap?.[funcName];
        if (funcData && typeof onFocusFunc === "function") {
          onFocusFunc?.(funcData);
        }
      }
    }
  }
}
