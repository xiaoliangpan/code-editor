import { ViewUpdate } from "@codemirror/view";
import { DecorationSet } from "@codemirror/view";
import {
  Decoration,
  ViewPlugin,
  MatchDecorator,
  EditorView,
  WidgetType,
} from "@codemirror/view";
import { cssConfig } from "../config";
import { varRegexp } from "../config/regexp";
import { PlaceholderThemesType } from "../interface";

export const placeholdersPlugin = (
  themes: PlaceholderThemesType,
  mode: string = "name"
) => {
  class PlaceholderWidget extends WidgetType {
    curFlag: string;
    text: string;

    constructor(text: string) {
      super();
      if (text) {
        // ${SYS.登录信息:LOGIN_INFO.地址:pAddr}

        const [curFlag, curTexts] = text.split("|");
        const texts = curTexts.split(".");

        if (curFlag && texts.length) {
          this.text = texts
            .map((t) => t.split(":")[mode === "code" ? 1 : 0])
            .join(".");
          this.curFlag = curFlag;
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
        backgroudColor: "#f5f5f5",
        borderColor: "#e0e0e0",
        textColor: "red",
      };
      elt.style.cssText = `
      border: 1px solid ${borderColor};
      border-radius: 4px;
      line-height: 20px;
      background: ${backgroudColor};
      color: ${textColor};
      font-size: 12px;
      padding: 2px 7px;
      user-select: none;
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
    // regexp: /\[\[(.+?)\]\]/g,
    regexp: varRegexp,
    decoration: (match) => {
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
