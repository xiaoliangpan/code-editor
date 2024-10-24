import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Button, Tabs, Space } from "antd";
import { useLocalStorageState } from "ahooks";

import Editor, {
  CommonPlaceholderThemes,
  FunctionType,
  ScriptEditorRef,
  CodeMode,
} from "@panxl/code-editor";
import type {} from "@panxl/code-editor";

import Function from "./component/function";
import ModelField from "./component/model-field";
import Operation from "./component/operation";

import { GlobalContext } from "./context";
import { Model, models } from "./data/model";
import { functions } from "./data/function";
import { operations } from "./data/operation";
import ModelList from "./pages/model-list";
import Keywords, { KeywordsConfigType } from "./pages/keywords";
import Functions from "./pages/functions";
import RunResult from "./pages/result";
import { hintPaths } from "./data/hint";
import { useCodeEditor } from "./hooks/use-code-editor";

const placeholderTypes = {
  // 这里各种变量类型
  Field: "f",
};

const placeholderThemes = {
  [placeholderTypes.Field]: CommonPlaceholderThemes.blue,
};

function App() {
  // const [value, setValue] = useState<string>();
  // const [mode, setMode] = useState<CodeMode>(CodeMode.NAME);
  const [modelListOpen, setModelListOpen] = useState(false);
  const [keywordsOpen, setKeywordsOpen] = useState(false);
  const [functionsOpen, setFunctionsOpen] = useState(false);
  const [runResultOpen, setRunResultOpen] = useState(false);
  const [formatFunctions, setFormatFunctions] = useState("");
  const [runResult, setRunResult] = useState("");
  const {
    completions,
    keywordsConfig,
    placeholderThemes,
    functions,
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
    changeMode,
    setKeywordsConfig,
  } = useCodeEditor({});
  const [localModels, setLocalModels] = useLocalStorageState<Model[]>(
    "model-list",
    { defaultValue: models }
  );
  const localFunctions = functions;
  // const [keywordsConfig, setKeywordsConfig] =
  //   useLocalStorageState<KeywordsConfigType>("keywords-config", {
  //     defaultValue: {
  //       color: "red",
  //       keywords: [],
  //     },
  //   });

  const tabs = useMemo(
    () => [
      {
        key: "model-field",
        label: "字段",
        children: (
          <ModelField
            placeholderTypes={placeholderTypes}
            models={localModels}
          />
        ),
      },
      {
        key: "function",
        label: "函数",
        children: <Function functions={functions || []} />,
      },
      {
        key: "operation",
        label: "逻辑运算符",
        children: <Operation operations={operations} />,
      },
    ],
    [localFunctions, operations, placeholderTypes, localModels]
  );

  const data = useMemo(() => {
    const data = localModels.reduce((prevModel: any, model: Model) => {
      prevModel[model.code] = model.children?.reduce(
        (prevField: any, field: Model) => {
          prevField[field.code] = field.value;
          return prevField;
        },
        {}
      );
      return prevModel;
    }, {});
    return {
      ...data,
      SYS: {
        LOGIN_INFO: {
          pAddr: "127.0.0.1",
        },
      },
      FORM: { title: "表单标题" },
    };
  }, []);

  const test = () => {
    if (!value) return;

    let result = value.replace(/\[\[(.+?)\]\]/g, (_: string, $2: string) => {
      const [type, ...rest] = $2.split(".");

      if (type === "f") {
        const [modelCode, fieldCode] = rest.map((t) => t.split(":")[1]);

        return `data?.['${modelCode}']?.['${fieldCode}']`;
      }

      return "";
    });

    result = result.replace(/\$\{(.+?)\}/g, (_: string, $2: string) => {
      const [type, ...rest] = $2.split(".");

      if (!!type) {
        const fieldData = rest.map((t) => t.split(":")[1])?.filter(Boolean);
        // console.log("modelCode", modelCode, "fieldCode", fieldCode);
        const filedStr = fieldData.map((i) => '["' + i + '"]').join("?.");
        return `data?.${type}?.${filedStr}`;
      }

      return "";
    });

    if (!result) return;
    // result = result.split("\n").pop() || "";

    if (!result) return;

    console.log(`function: return ${result}`);
    const funcs = localFunctions.reduce((prev: { [k in string]: any }, cur) => {
      if (cur.handle) {
        const handle = new window.Function(`return ${cur.handle}`);
        prev[cur.label] = handle();
      }

      return prev;
    }, {});
    let runRes;
    let func;
    // const func = new window.Function("func", "data", `return ${result}`);
    try {
      func = new window.Function(
        "func",
        "data",
        `with(func,data,{
        ...func,
        ...data
        }) {
        return ${result}
         }`
      );

      runRes = func(funcs, data);
    } catch (e) {
      console.error("运行时执行报错:", e);
    }

    setFormatFunctions(`return ${result}`);
    setRunResult(runRes);
    setRunResultOpen(true);
  };

  const open = () => {
    window.open("https://github.com/dbfu/bp-script-editor");
  };

  // const completions = useMemo(
  //   () => [...localFunctions, ...operations],
  //   [localFunctions, operations]
  // );
  const runScript = (
    codeStr: string,
    functions: { [k in string]: FunctionType },
    data: Record<string, any>
  ) => {
    if (!codeStr) return;
    // 解析变量  格式：[[f.用户:user.ID:id]] /\[\[(.+?)\]\]/g
    let result = codeStr.replace(/\[\[(.+?)\]\]/g, (_: string, $2: string) => {
      const [type, ...rest] = $2.split(".");

      if (type === "f") {
        //[[f.用户:user.ID:id]]
        const [modelCode, fieldCode] = rest
          .map((t) => t.split(":")[1])
          ?.filter(Boolean);
        return `data?.['${modelCode}']?.['${fieldCode}']`;
      }

      return "";
    });

    if (!result) return;
    // 执行器
    const funcRun = new window.Function(
      "func",
      "data",
      `with(func,data,{
      ...func,
      ...data
      }) {
      return ${result}
       }`
    );
    // 运行所有函数
    const funcs = functions?.reduce((prev: { [k in string]: any }, cur) => {
      if (cur.handle) {
        const handle = new window.Function(`return ${cur.handle}`);
        prev[cur.label] = handle();
      }

      return prev;
    }, {});
    let runRes;
    try {
      runRes = funcRun(funcs, data);
    } catch (e) {
      console.log("代码运行时出错：", e);
    }
    return runRes;
  };
  console.log("editorRef", editorRef?.current?.getUsedFuncList());
  return (
    <GlobalContext.Provider value={{ editorRef }}>
      <div>
        <div className="h-[48px] flex items-center bg-[rgb(68,75,81)] justify-end px-[20px]">
          <Space>
            <Button
              onClick={() => {
                // editorRef?.current?.insertText("[[f.用户:user.ID:id]]");
                // editorRef?.current?.insertText("${SYS.CUR_USER}");
                // editorRef?.current?.insertText(
                //   "${SYS.LOGIN_INFO:登录信息.ipAddr:地址}"
                // );
                editorRef?.current?.insertText(
                  "${SYS.登录信息:LOGIN_INFO.地址:pAddr}"
                );
                // editorRef?.current?.insertText("${FORM.标题:title}");
              }}
              type="primary"
            >
              插入变量
            </Button>
            <Button
              onClick={() => {
                setModelListOpen(true);
              }}
              type="primary"
            >
              定义模型
            </Button>
            <Button
              onClick={() => {
                setFunctionsOpen(true);
              }}
              type="primary"
            >
              定义函数
            </Button>
            <Button
              onClick={() => {
                setKeywordsOpen(true);
              }}
              type="primary"
            >
              定义关键字
            </Button>
            <Button onClick={test} type="primary">
              测试
            </Button>
            <Button
              onClick={() => {
                if (editorRef.current?.clearText) {
                  editorRef.current.clearText();
                }
              }}
              type="primary"
            >
              清空
            </Button>
            <Button
              onClick={() => {
                changeMode?.();
              }}
              type="primary"
            >
              {mode === "name" ? "代码模式" : "名称模式"}
            </Button>
            <a
              onClick={open}
              title="github"
              className="text-white text-[20px] cursor-pointer"
            >
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="github"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"></path>
              </svg>
            </a>
          </Space>
        </div>

        <div className="flex">
          <div className="w-[360px] flex-0 p-[12px] border-solid border-[#ccc] border-[1px]">
            <Tabs items={tabs} tabPosition="left" />
          </div>
          <div className="flex-1 w-0">
            <Editor
              completions={completions || []}
              keywords={keywordsConfig?.keywords}
              keywordsColor={keywordsConfig?.color}
              placeholderThemes={placeholderThemes}
              functions={localFunctions || []}
              ref={editorRef}
              height="calc(100vh - 48px)"
              mode={mode}
              value={value}
              hintPaths={hintPaths}
              onValueChange={onValueChange}
              placeholder="请输入代码"
              onFocusFunc={(data) => {
                console.log("onFocusFunc--", data);
              }}
            />
          </div>
        </div>
        <ModelList
          onModelsChange={setLocalModels}
          open={modelListOpen}
          onClose={() => {
            setModelListOpen(false);
          }}
          models={localModels}
        />
        <Keywords
          onClose={() => {
            setKeywordsOpen(false);
          }}
          onChange={setKeywordsConfig}
          open={keywordsOpen}
          keywordsConfig={keywordsConfig}
        />
        <Functions
          open={functionsOpen}
          functions={localFunctions}
          // onChange={setLocalFunctions}
          onClose={() => {
            setFunctionsOpen(false);
          }}
        />
        <RunResult
          formatFunctions={formatFunctions}
          result={runResult}
          open={runResultOpen}
          onClose={() => {
            setRunResultOpen(false);
          }}
        />
      </div>
    </GlobalContext.Provider>
  );
}

export default App;
