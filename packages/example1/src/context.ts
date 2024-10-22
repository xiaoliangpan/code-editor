import React from "react";
import { ScriptEditorRef } from "@panxl/code-editor";

export interface ContextType {
  editorRef: React.RefObject<ScriptEditorRef> | null;
}

export const GlobalContext = React.createContext<ContextType>({
  editorRef: null,
});
