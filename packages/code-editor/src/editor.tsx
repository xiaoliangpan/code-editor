import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
  ForwardRefRenderFunction,
  useMemo,
  useEffect,
} from "react";
import { githubLight } from "@uiw/codemirror-theme-github";
import ReactCodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { snippet } from "@codemirror/autocomplete";
import { Extension } from "@codemirror/state";
import { deepClone, getFuncId } from "./utils";
import { insertInputIntoFunction, removeCommentsText } from "./utils/var";
import { extensions } from "./extensions";
import {
  CompletionsType,
  FunctionType,
  HintPathType,
  PlaceholderThemesType,
  ScriptEditorRef,
  CodeMode,
} from "./interface";

interface PropsType {
  completions: CompletionsType[];
  keywords?: string[];
  onValueChange?: (value: string) => void;
  placeholderThemes: PlaceholderThemesType;
  mode: CodeMode;
  functions: FunctionType[];
  height?: string;
  width?: string;
  keywordsClassName?: string;
  keywordsColor?: string;
  defaultValue?: string;
  hintPaths?: HintPathType[];
  extensions?: Extension[];
  value?: string;
  placeholder?: string;
  readonly?: boolean;
  onFocusFunc?: (funcName: string) => void;
  // 是否使用函数功能
  isUseFun: boolean;
  // 变量keyToName 映射
  varKeyToNameMap: Record<string, string>;
}

const Editor: ForwardRefRenderFunction<ScriptEditorRef, PropsType> = (
  {
    completions,
    onValueChange,
    keywords,
    placeholderThemes,
    mode,
    functions,
    height,
    width,
    keywordsColor,
    keywordsClassName,
    hintPaths,
    extensions: extensionsProps,
    value,
    placeholder = "请输入代码...",
    readonly,
    onFocusFunc,
    isUseFun = true,
    varKeyToNameMap = {},
  },
  ref
) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const functionsMapRef = useRef<Record<string, FunctionType>>({});
  functionsMapRef.current = functions?.reduce((prev, cur) => {
    const key = cur?.label;
    prev[key] = cur;
    return prev;
  }, {});

  const insertText = useCallback(
    (text: string, isTemplate?: boolean) => {
      const { view } = editorRef.current!;
      if (!view) return;
      if (readonly) return;

      const { state } = view;
      if (!state) return;

      const [range] = state?.selection?.ranges || [];

      if (isTemplate) {
        snippet(text)(
          {
            state,
            dispatch: view.dispatch,
          },
          {
            label: text,
            detail: text,
          },
          range.from,
          range.to
        );
      } else {
        view.dispatch({
          changes: {
            from: range.from,
            to: range.to,
            insert: text,
          },
          selection: {
            anchor: range.from + text.length,
          },
        });
      }
      view.focus();
    },
    [readonly]
  );

  const clearText = useCallback(() => {
    const { view } = editorRef.current;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: "",
      },
      selection: {
        anchor: 0,
      },
    });
    view.focus();
  }, []);

  const setText = useCallback((text: string) => {
    const { view } = editorRef.current;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: text,
      },
      selection: {
        anchor: text.length,
      },
    });
    view.focus();
  }, []);
  const getUsedFuncList = () => {
    const { view } = editorRef.current;
    if (!view) return;
    const usedFuncList = [];
    const currentValue = view?.state?.doc.toString() || "";
    if (!currentValue) return;

    const codeArr = deepClone(currentValue).split("\n");

    if (Boolean(isUseFun) && functions?.length > 0) {
      const funcRegexp = new RegExp(
        functions
          .map((data: any) => {
            return "\\b" + data.title + "\\b";
          })
          .join("|"),
        "g"
      );
      for (let i = 0; i < currentValue.length; i++) {
        const lineStr = codeArr[i];

        let match: any;
        while ((match = funcRegexp.exec(lineStr)) !== null) {
          const variable = match[0];
          if (lineStr[match["index"] + variable?.length] === "(") {
            const funcId = getFuncId(variable, functions);

            funcId && usedFuncList.push(funcId);
          }
        }
      }
    }
    return usedFuncList;
  };
  // 插入函数自动补全（）
  const insertFun = (input: string) => {
    const editorView = editorRef?.current?.view;
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { from, to } = editorView?.state?.selection?.main;

    const text = `${input}()`;
    const transaction = editorView?.state?.update?.({
      changes: {
        from,
        to,
        insert: text,
      },
      selection: {
        anchor: from + text.length - 1,
      },
    });
    editorView?.dispatch(transaction);
    editorView?.focus?.();
  };
  // 插入变量自动补全 ','
  const insertVar = (input: string) => {
    const editorView = editorRef?.current?.view;

    // 获取当前光标位置和编辑器内容
    const pos = editorView.state.selection.main.head; // 获取光标位置
    const value = editorView.state.doc.toString(); // 获取当前编辑器内容

    const newInput = insertInputIntoFunction(value, pos, input);

    // 更新编辑器内容
    editorView.dispatch({
      changes: {
        from: pos, // 从光标位置插入
        to: pos, // 不替换任何内容，仅插入
        insert: newInput, // 插入的内容
      },
      selection: { anchor: pos + newInput.length }, // 更新光标位置
    });
    // 让编辑器聚集
    editorView.focus();
  };
  // 原始内容（去除注释）
  const originalText = () => {
    const { view } = editorRef.current;
    if (!view) return;
    const currentValue = view?.state?.doc.toString() || "";
    console.log("originalText", removeCommentsText(currentValue));
    return removeCommentsText(currentValue);
  };
  useImperativeHandle(
    ref,
    () => {
      return {
        insertText,
        clearText,
        setText,
        getUsedFuncList,
        insertFun,
        insertVar,
        originalText,
        originEditorRef: editorRef,
      };
    },
    [
      insertText,
      clearText,
      setText,
      functions,
      editorRef.current,
      insertFun,
      insertVar,
      originalText,
    ]
  );

  const extensionsMemo = useMemo(
    () => [
      ...extensions({
        completions,
        keywords,
        placeholderThemes,
        mode,
        functions,
        keywordsColor,
        keywordsClassName,
        hintPaths,
        readonly,
        onFocusFunc,
        functionsMap: functionsMapRef.current,
        varKeyToNameMap,
      }),
      ...(extensionsProps || []),
    ],
    [
      completions,
      keywords,
      placeholderThemes,
      mode,
      functions,
      keywordsColor,
      keywordsClassName,
      hintPaths,
      extensionsProps,
      onFocusFunc,
      functionsMapRef.current,
      varKeyToNameMap,
    ]
  );

  const onChangeHandle = useCallback(
    (value: string) => {
      onValueChange && onValueChange(value);
    },
    [onValueChange]
  );

  return (
    <ReactCodeMirror
      height={height}
      width={width}
      extensions={extensionsMemo}
      theme={githubLight}
      onChange={onChangeHandle}
      value={value}
      ref={editorRef}
      placeholder={!readonly && placeholder}
      readOnly={readonly}
    />
  );
};

export default forwardRef<ScriptEditorRef, PropsType>(Editor);
