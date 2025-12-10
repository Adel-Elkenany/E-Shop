import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import Input from "../inputs";
import { PlusCircle, Trash2Icon } from "lucide-react";

const CustomSpecifications = ({ control, errors }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "",
  });
  return (
    <div>
      <label className="block text-gray-300 font-semibold mb-1">
        Custom Specifications
      </label>
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Controller
              name={`custom_specification.${index}.name`}
              control={control}
              rules={{ required: "Specification Name is required" }}
              render={({ field }) => (
                <Input
                  label={`Specification Name`}
                  placeholder="e.g. Battery Life, Weight, Material, etc"
                  {...field}
                />
              )}
            />
            <Controller
              name={`custom_specification.${index}.value`}
              control={control}
              rules={{ required: "Specification Value is required" }}
              render={({ field }) => (
                <Input
                  label={`Specification Value`}
                  placeholder="e.g. 200mAh, 1 kg, Plastic, etc"
                  {...field}
                />
              )}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="px-2 py-1 transition-all duration-300 text-red-500"
            >
             <Trash2Icon className="w-5 h-5 " />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({name:"", value:""})}
          className="flex items-center gap-2  mt-1 text-blue-500 rounded transition-all duration-300"
        >
          <PlusCircle className="w-5 h-5" /> Add Specification
        </button>
      </div>
      {errors?.custom_specification && (
        <span className="text-red-500 text-sm">
          {errors.custom_specification.message as string}
        </span>
      )}
    </div>
  );
};

export default CustomSpecifications;
