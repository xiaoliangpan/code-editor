//TODO types 要独立抽取出去
import type { DataNode } from 'antd/lib/tree';
export const formatEnum = {
  YEAR: 'YYYY',
  YEAR_MONTH: 'YYYY-MM',
  YEAR_DATE: 'YYYY-MM-DD',
  YEAR_HOUR: 'YYYY-MM-DD HH:00',
  YEAR_MIN: 'YYYY-MM-DD HH:mm',
  YEAR_SEC: 'YYYY-MM-DD HH:mm:ss',
  HOUR_MIN: 'HH:mm',
  HOUR_SEC: 'HH:mm:ss'
};

export type WidgetField = {
  fieldComment: string;
  fieldKey: string;
  fieldName: string;
  fieldType: string;
  id: string;
  propertyWidget: string;
  refType: string;
  configJson: any;
  relFunId?: string;
};
export type OptionField = {
  code: string;
  name: string;
  disabled?: boolean;
  //当disabled=true的时候extract不存在
  extract?: OptionFieldExtract;
};

export interface Extract extends Record<string, any> {
  funCode?: string;
  appCode?: string;
}
declare type ButtonItem = {
  code: string;
  name: string;
  extract: {
    icon: string;
    action: string;
    type: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed' | undefined;
    needConfirm?: boolean | undefined;
    disabled?: boolean | undefined;
    batch?: boolean | undefined;
    system?: boolean | undefined;
  };
};

declare type ButtonItem = {
  code: string;
  name: string;
  extract: {
    icon: string;
    action: string;
    type: 'link' | 'text' | 'ghost' | 'default' | 'primary' | 'dashed' | undefined;
    needConfirm?: boolean | undefined;
    disabled?: boolean | undefined;
    batch?: boolean | undefined;
    system?: boolean | undefined;
  };
};
export enum FIELD_TYPE_PROPS {
  EMPTY = '',
  // 文本
  TEXT = 'TEXT',
  STRING = 'STRING',

  // 日期
  DATE = 'DATE',
  DATE_TIME = 'DATE_TIME',
  // 人员
  USER = 'USER',
  USER_MULTI = 'USER_MULTI',
  // 部门
  ORG = 'ORG',
  ORG_MULTI = 'ORG_MULTI',
  // 数字
  NUM = 'NUM',
  // 布尔
  BOOL = 'BOOL',
  // 枚举
  ENUM = 'ENUM',
  ENUM_MULTI = 'ENUM_MULTI',
  // 文件
  FILE = 'FILE',

  // 公式：数值类
  FORMULA = 'FORMULA',

  DOUBLE = 'DOUBLE',
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  PERCENT = 'PERCENT',

  YEAR = 'YEAR',
  YEAR_MONTH = 'YEAR_MONTH',
  YEAR_HOUR = 'YEAR_HOUR',
  YEAR_DATE = 'YEAR_DATE',
  YEAR_MIN = 'YEAR_MIN',
  YEAR_SEC = 'YEAR_SEC',
  HOUR = 'HOUR',
  HOUR_MIN = 'HOUR_MIN',
  HOUR_SEC = 'HOUR_SEC',

  TREE = 'TREE',
  REL = 'REL',
  REL_MULTI = 'REL_MULTI',
  REL_FIELD = 'REL_FIELD',

  TABLE = 'TABLE',

  // 流程专用
  FLOW_WF_APRV_USR = 'FLOW_WF_APRV_USR',
  FLOW_WF_DQ_MODEL = 'FLOW_WF_DQ_MODEL',
  FLOW_WF_RECORD = 'FLOW_WF_RECORD',

  //参数专用
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',

  // 组合文本，用于文本和变量组合
  COMBINED_TEXT = 'COMBINED_TEXT',
  // 时间
  TIME = 'TIME'
}

export interface ColsTreeProps extends DataNode {
  attrs?: { titleStr: string; fieldGroupType: FIELD_TYPE_PROPS; key: string }[];
  key: string;
  titleStr?: string;
  iconName?: string;
  widget?: string;
  fieldGroupType?: FIELD_TYPE_PROPS;
  children?: ColsTreeProps[];
}
export interface FunctionProps {
  title: string;
  key: string;
  selectable?: boolean;
  icon?: any;
  children?: FunctionProps[];
  desc?: string;
  formula?: string;
  params?: any;
  returnType?: string;
  demon?: string;
  funcNameEg: string;
}

export interface KeywordsConfigType {
  keywords: string[];
  color: string;
}

export const enum FuncCategory {
  // 文本类型
  TEXT = 'TEXT',
  // 日期
  DATE = 'DATE',
  // 数学函数
  MATH = 'MATH',
  // 逻辑
  LOGICAL = 'LOGICAL'
}
export enum ParamType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT'
}
export enum ReturnType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT'
}
export interface ParamsList {
  id: string;
  name: string;
  type: ParamType;
  required: boolean;
  varargs: boolean;
  functionId: string;
}
/**
       {
        id: 'EbnWJBS8tO10v7GhIrP',
        funcName: '从左提取字符',
        description: '用于从文本中提取左边指定数目的字符',
        sysFunc: '1',
        funcNameEg: 'LEFT',
        dataType: 'STRING',
        sourceCorpCode: 'default',
        methodView: 'LEFT(text,[num_chars])',
        executeDemo: 'LEFT(青谷科技,2)，返回结果：青谷',
        relPlugins: 'c8YRNqXYsNfllQeCaVg',
        authRange: 'CORP',
        sourceApp: '',
        commonUse: false,
        funcCategory: 'TEXT',
        fileId: '6684713955706880',
        paramsList: [
          {
            id: '7a2slxXj9LDC7xQclb9',
            name: 'text',
            type: 'STRING',
            required: true,
            varargs: false,
            functionId: 'EbnWJBS8tO10v7GhIrP'
          },
          {
            id: 'hFEWShTkIbbqHoi8WbJ',
            name: 'num_chars',
            type: 'NUM',
            required: false,
            varargs: false,
            functionId: 'EbnWJBS8tO10v7GhIrP'
          }
        ],
        title: 'LEFT',
        key: 'EbnWJBS8tO10v7GhIrP',
        titleDesc: '从左提取字符',
        formula: 'LEFT(text,[num_chars])',
        desc: '用于从文本中提取左边指定数目的字符',
        returnType: 'STRING',
        demon: 'LEFT(青谷科技,2)，返回结果：青谷'
      },
 */
export interface QXFunctionItem {
  id: string;
  // 英文名称
  label: string;
  // 模板
  template: string;
  // 函数源码
  handle: string;
  // 详情
  detail: string;
  // 函数中文名
  funcName: string;
  // 描述
  description: string;
  sysFunc: '1';
  // 函数英文名
  funcNameEg: string;
  dataType: string;
  sourceCorpCode: string;
  methodView: string;
  executeDemo: string;
  relPlugins: string;
  authRange: string;
  sourceApp: string;
  commonUse: boolean;
  funcCategory: FuncCategory;
  fileId: string;
  paramsList: ParamsList[];
  title: string;
  key?: string;
  titleDesc: string;
  // 表达式 如：LEFT(text,[num_chars])
  formula: string;
  desc: string;
  // 返回值类型 STRING
  returnType: ReturnType;
  // 示例 LEFT(青谷科技,2)，返回结果：科技
  demon: string;
}
// 函数列表树结构
export interface QXFunctionListTreeItem {
  key: string;
  title: string;
  selectable: boolean;
  children: QXFunctionItem[];
}
