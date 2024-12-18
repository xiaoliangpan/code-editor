import {
  Decoration,
  ViewPlugin,
  MatchDecorator,
  EditorView,
  WidgetType,
  DecorationSet,
  ViewUpdate,
} from "@codemirror/view";
import { cssConfig } from "../config";
import { varRegexp } from "../config/regexp";
import { PlaceholderThemesType } from "../interface";
import { formatCommentsText, isValidFormat } from "../utils/var";

export const placeholdersPlugin = (
  themes: PlaceholderThemesType,
  mode: string = "name",
  varKeyToNameMap: Record<string, string> = {}
) => {
  class PlaceholderWidget extends WidgetType {
    curFlag: string;
    text: string;

    constructor(text: string) {
      super();
      const handleText = (text) => {
        // SYS|登录信息:LOGIN_INFO.地址:pAddr
        const [curFlag, curTexts] = text.split("|");
        const texts = curTexts.split(".");

        if (curFlag && texts.length) {
          this.text = texts
            .map((t) => t.split(":")[mode === "code" ? 1 : 0])
            .join(".");
          this.curFlag = curFlag;
        } else if (curFlag) {
          console.log("else", curFlag, "curtext", curTexts);
          this.curFlag = curFlag;
          this.text = `${varKeyToNameMap?.[curTexts]}: ${curTexts}`;
        }
      };

      if (text) {
        if (isValidFormat(text)) {
          handleText(text);
        } else {
          const newText = formatCommentsText(text, varKeyToNameMap);

          handleText(newText);
        }
      }
    }

    eq(other: PlaceholderWidget) {
      return this.text == other.text;
    }

    toDOM() {
      let elt = document.createElement("span");
      if (!this.text) return elt;

      const { backgroudColor, borderColor, textColor } = themes?.[
        this?.curFlag || "f"
      ] || {
        backgroudColor: "rgb(201, 223, 252)",
        borderColor: "transparent",
        textColor: "rgb(2, 107, 225)",
      };
      elt.style.cssText = `
      border: 1px solid ${borderColor};
      border-radius: 4px;
      line-height: 20px;
      background: ${backgroudColor};
      color: ${textColor};
      border-radius: 2px;
      font-size: 12px;
      padding: 1px 3px;
      user-select: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      `;
      elt.className = cssConfig?.placeholderClass;
      elt.textContent = this.text;
      return elt;
    }
    ignoreEvent() {
      return true;
    }
  }

  const placeholderMatcher = new MatchDecorator({
    regexp: varRegexp,
    decoration: (match) => {
      // console.log("match[1]", match[1]);
      return Decoration.replace({
        widget: new PlaceholderWidget(match[1]),
      });
    },
  });

  return ViewPlugin.fromClass(
    class {
      placeholders: DecorationSet;
      constructor(view: EditorView) {
        this.placeholders = placeholderMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.placeholders = placeholderMatcher.updateDeco(
          update,
          this.placeholders
        );
      }
    },
    {
      decorations: (instance: any) => {
        return instance.placeholders;
      },
      provide: (plugin: any) =>
        EditorView.atomicRanges.of((view: any) => {
          return view.plugin(plugin)?.placeholders || Decoration.none;
        }),
    }
  );
};
