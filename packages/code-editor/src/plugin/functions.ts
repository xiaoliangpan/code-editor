import { DecorationSet } from "@codemirror/view";
import { ViewUpdate } from "@codemirror/view";
import { EditorView, WidgetType } from "@codemirror/view";
import { Decoration, ViewPlugin, MatchDecorator } from "@codemirror/view";
import { FunctionType } from "../interface";
import { cssConfig } from "../config";

export const functionPlugin = (functions: FunctionType[]) => {
  class FunctionWidget extends WidgetType {
    text: string;

    constructor(text: string) {
      super();
      this.text = text;
    }

    eq(other: FunctionWidget) {
      return this.text == other.text;
    }

    toDOM() {
      const elt = document.createElement("span");
      elt.className = cssConfig?.funcNameClass;
      elt.setAttribute("data-func-name", this.text);
      elt.style.cssText = `
      color: #d73a49;
      font-size: 14px;
      `;
      elt.textContent = this.text;
      elt.dataset.name = this.text;

      const span = document.createElement("span");
      span.style.cssText = "color: #6a737d;";
      span.className = "cm-function";
      span.textContent = "(";
      elt.appendChild(span);
      return elt;
    }
    ignoreEvent() {
      return false;
    }
  }

  const functionMatcher = new MatchDecorator({
    regexp: /(func\.)?(\w+?)\(/g,
    decoration: (match) => {
      const funcName = match[2];
      if (functions.some((o) => o.label === funcName)) {
        return Decoration.replace({
          widget: new FunctionWidget(`${funcName}`),
        });
      }
      return null;
    },
  });

  return ViewPlugin.fromClass(
    class {
      function: DecorationSet;
      constructor(view: EditorView) {
        this.function = functionMatcher.createDeco(view);
      }
      update(update: ViewUpdate) {
        this.function = functionMatcher.updateDeco(update, this.function);
      }
    },
    {
      decorations: (instance: any) => {
        return instance.function;
      },
      provide: (plugin: ViewPlugin<any>) =>
        EditorView.atomicRanges.of((view) => {
          return view.plugin(plugin)?.function || Decoration.none;
        }),
    }
  );
};
