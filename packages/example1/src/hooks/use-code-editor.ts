import { ScriptEditorRef, CodeMode } from "@panxl/code-editor";
import { useLocalStorageState } from "ahooks";
import { useRef, useState, useCallback } from "react";
import { useControllableValue } from "ahooks";
import { funListTree, placeholderThemes, hintPaths } from "../config";
import {
  KeywordsConfigType,
  QXFunctionItem,
  QXFunctionListTreeItem,
} from "../constant";
const funcChildrenList = (
  funcListTree: QXFunctionListTreeItem[]
): QXFunctionItem[] => {
  return funcListTree.reduce((prev: any[], cur) => {
    if (cur.children) {
      prev = [...prev, ...cur.children];
    }
    return prev;
  }, []);
};
const formatFunctionData = (data: QXFunctionItem[]) => {
  return data.map((item) => {
    return {
      ...item,
      // id: item?.id,
      label: item?.funcNameEg,
      detail: item?.description,
      template: item?.formula,
    };
  });
};
export interface CodeEditorProps {
  onFocusFunc?: (funcData: QXFunctionItem) => void;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  height?: string;
}
export const useCodeEditor = (props: CodeEditorProps) => {
  const {
    placeholder = "请输入代码...",
    height = "198px",
    onFocusFunc,
  } = props;

  const [value, setValue] = useControllableValue<string>(props, {
    defaultValue: "",
  });

  const editorRef = useRef<ScriptEditorRef>(null);
  // 关键字配置
  const [keywordsConfig, setKeywordsConfig] =
    useLocalStorageState<KeywordsConfigType>("keywords-config", {
      defaultValue: {
        color: "red",
        keywords: [],
      },
    });
  const [mode, setMode] = useState("name");
  // 本地函数
  const [localFunctions, setLocalFunctions] = useLocalStorageState<
    QXFunctionItem[]
  >("functions", {
    defaultValue: formatFunctionData(funcChildrenList(funListTree)),
  });
  // 本地变量
  const [localVariables, setLocalVariables] = useLocalStorageState<
    QXFunctionItem[]
  >("variables", {
    defaultValue: formatFunctionData(funcChildrenList(funListTree)),
  });
  const onValueChange = useCallback((value: string) => {
    console.log("value", value);

    setValue(value);
  }, []);
  const insertFun = () => {};
  const insertVar = () => {};

  return {
    completions: localFunctions,
    keywordsConfig,
    placeholderThemes,
    functions: localFunctions,
    editorRef,
    height,
    mode,
    value,
    hintPaths,
    onValueChange,
    placeholder,
    onFocusFunc,
    insertFun,
    insertVar,
    changeMode: () =>
      setMode((prev) =>
        prev === CodeMode.NAME ? CodeMode.CODE : CodeMode.NAME
      ),
    setKeywordsConfig,
  };
};
