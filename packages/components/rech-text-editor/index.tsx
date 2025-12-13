"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const modules = useMemo(
    () => ({
      toolbar: [
       [{font:[]},{size:[]}],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "image"],
        ["clean"],
        ["code-block"],
        ["formula"],
        ["video"],
        ["table"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "link",
    "image",
    "code-block",
    "formula",
    "video",
    "table",
  ];

  return (
    <div style={{ minHeight: "310px" }} className="w-full bg-black border border-gray-600 mt-3 rounded-md text-white outline-none">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;
