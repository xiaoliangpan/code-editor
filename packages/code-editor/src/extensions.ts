import { autocompletion } from "@codemirror/autocomplete";
import { EditorView, highlightActiveLine, placeholder } from "@codemirror/view";
import {
  CompletionsType,
  FunctionType,
  HintPathType,
  PlaceholderThemesType,
} from "./interface";
import { javascript } from "@codemirror/lang-javascript";
import { baseTheme } from "./plugin/base-theme";
import { customCompletions } from "./plugin/custom-completions";
import { functionPlugin } from "./plugin/functions";
import { keywordsPlugin } from "./plugin/keywords";
import { placeholdersPlugin } from "./plugin/placeholders";
import { hintPlugin } from "./plugin/hint";
import { focusFunction } from "./plugin/focus-function";

export const extensions = ({
  completions,
  keywords,
  placeholderThemes,
  mode,
  functions,
  keywordsColor,
  keywordsClassName,
  hintPaths,
  onFocusFunc,
  functionsMap,
}: {
  keywords?: string[];
  completions: CompletionsType[];
  placeholderThemes: PlaceholderThemesType;
  mode: string;
  functions: FunctionType[];
  keywordsColor?: string;
  keywordsClassName?: string;
  hintPaths?: HintPathType[];
  readonly?: boolean;
  onFocusFunc?: (funcName: string) => void;
  functionsMap: Record<string, FunctionType>;
}): any[] => {
  return [
    EditorView.domEventHandlers({
      // 处理 mousedown 事件
      mousedown: (event: MouseEvent, view: EditorView) => {
        focusFunction(event, functionsMap, onFocusFunc);
      },
    }),
    keywords.length
      ? keywordsPlugin(keywords, keywordsColor, keywordsClassName)
      : null,
    baseTheme,
    placeholdersPlugin(placeholderThemes, mode),
    EditorView.lineWrapping,
    autocompletion({
      override: [
        customCompletions(completions),
        hintPaths?.length ? hintPlugin(hintPaths) : null,
      ].filter((o) => !!o),
    }),
    // javascript(),
    functionPlugin(functions),
    highlightActiveLine(),
  ].filter((o) => !!o);
};
