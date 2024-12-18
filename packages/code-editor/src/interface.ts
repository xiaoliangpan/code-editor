import { ReactCodeMirrorRef } from "@uiw/react-codemirror";

import { MutableRefObject } from "react";

export interface CompletionsType {
  template: string;
  label: string;
  detail: string;
  type: string;
  key: string;
}

export interface PlaceholderThemesType {
  [K: string]: CommonPlaceholderTheme;
}

export interface FunctionType extends CompletionsType {
  handle: any;
}

export interface CommonPlaceholderTheme {
  textColor: string;
  backgroudColor: string;
  borderColor: string;
}

export interface ScriptEditorRef {
  insertText: (text: string, isTemplate: boolean) => void;
  clearText?: () => void;
  setText?: (text: string) => void;
  getUsedFuncList?: () => FunctionType[];
  originEditorRef?: MutableRefObject<ReactCodeMirrorRef>;
  insertVar: (text: string) => void;
  insertFun: (text: string) => void;
  originalText: () => string;
}

export interface HintPathType {
  label: string;
  detail: string;
  type: "function" | "keyword" | "variable" | "text" | "property";
  template: string;
  children?: HintPathType[];
}

export enum CodeMode {
  NAME = "name",
  CODE = "code",
}
