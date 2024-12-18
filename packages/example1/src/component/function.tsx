import React, { useContext, FC } from "react";
import { Tooltip } from "antd";
import { GlobalContext } from "../context";
import { FunctionType } from "@panxl/code-editor";

interface PropsTypes {
  functions: FunctionType[];
}

const Function: FC<PropsTypes> = ({ functions }) => {
  const { editorRef } = useContext(GlobalContext);

  return (
    <div>
      {functions.map((item, idx) => (
        <Tooltip placement="right" key={item.label + idx} title={item.detail}>
          <div
            onClick={() => {
              if (editorRef?.current?.insertText) {
                editorRef.current.insertFun(`${item.label}`);
              }
            }}
            className="px-[12px] py-[4px] hover:(bg-[rgba(0,0,0,0.04)]) cursor-pointer rounded-md"
          >
            {item.label}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export default Function;
