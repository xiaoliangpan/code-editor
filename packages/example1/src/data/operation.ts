import { CompletionsType } from "@vilin/code-editor";

export const operations: CompletionsType[] = [
  {
    key: "==",
    label: "==",
    template: "== ",
    detail: "判断两遍是否相等",
    type: "keyword",
  },
  {
    key: "!=",
    label: "!=",
    template: "!= ",
    detail: "判断两遍是否不相等",
    type: "keyword",
  },
  {
    key: ">",
    label: ">",
    template: "> ",
    detail: "判断是否大于",
    type: "keyword",
  },
  {
    key: "<",
    label: "<",
    template: "< ",
    detail: "判断是否小于",
    type: "keyword",
  },
  {
    key: ">=",
    label: ">=",
    template: ">= ",
    detail: "判断两遍是否不相等",
    type: "keyword",
  },
  {
    key: "+",
    label: "+",
    template: "+ ",
    detail: "加",
    type: "keyword",
  },
  {
    key: "-",
    label: "-",
    template: "- ",
    detail: "减",
    type: "keyword",
  },
  {
    key: "*",
    label: "*",
    template: "* ",
    detail: "乘",
    type: "keyword",
  },
  {
    key: "/",
    label: "/",
    template: "/ ",
    detail: "除",
    type: "keyword",
  },
];
