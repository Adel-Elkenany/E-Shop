import React from "react";
import { forwardRef } from "react";

interface BaseProps {
  label: string;
  type?: "text" | "number" | "email" | "password" | "date" | "textarea";
  // className: string;
  // errors?: any;
}
type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type Props = InputProps | TextareaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(  // قم بفصل (Destructure) type, label, و className، واجمع الباقي في restProps
  ({ label, type = "text", className, ...restProps }, ref) => {
    return (
      <div className="w-full transition-all duration-300">
        {label && (
          <label className="block text-gray-300 font-semibold mb-2">
            {label}
          </label>
        )}
        
        {type === "textarea" ? (
          <textarea
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            className={`w-full border-[1px] border-gray-600 bg-black p-2 rounded-md text-white outline-none ${className}`}
            {...restProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>} 
          />
        ) : (
          <input
            type={type}
            ref={ref as React.RefObject<HTMLInputElement>}
            className={`w-full border-[1px] border-gray-600 bg-black p-2 rounded-md text-white outline-none ${className}`}
            {...restProps as React.InputHTMLAttributes<HTMLInputElement>}
          />
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
