import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Input from "../inputs";
import { PlusCircle, X } from "lucide-react";

const CustomProperties = ({ control, errors }: any) => {
  const [properties, setProperties] = useState<
    { label: string; value: string[] }[]
  >([]);
  const [newLabel, setNewLabel] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");

  return (
    <div>
      <div className="flex flex-col gap-2">
        <Controller
          name={`CustomProperties`}
          control={control}
          render={({ field }) => {
            useEffect(() => {
              field.onChange(properties);
            }, [properties]);

            const addProperty = () => {
              if (!newLabel.trim()) return;
              setProperties([...properties, { label: newLabel, value: [] }]);
              setNewLabel("");
            };

            const addValue = (index: number) => {
              if (!newValue.trim()) return;
              const updatedProperties = [...properties];
              updatedProperties[index].value.push(newValue);
              setProperties(updatedProperties);
              setNewValue("");
            };

            const removeProperty = (index: number) => {
              setProperties(properties.filter((_, i) => i !== index));
            };

            return (
              <>
                <div className="mt-2">
                  <label className="block font-medium text-gray-200 mb-1">
                    Custom Properties
                  </label>
                  <div className="flex flex-col gap-2">
                    {/* Exisiting Properties */}
                    {properties.map((property, index) => (
                      <div key={index} className="p-3 rounded-lg ">
                        <div className="flrx items-center justify-between">
                          <span className="text-gray-200 font-medium">
                            {property.label}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeProperty(index)}
                            className="px-2 py-1 transition-all duration-300 text-red-500"
                          >
                            <X className="w-5 h-5 " />
                          </button>
                        </div>

                        {/* Add Value to peoprety */}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            className="outline-none w-full bg-black p-2 rounded-md text-gray-200"
                            placeholder="Enter Value ..."
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                          />

                          <button
                            type="button"
                            onClick={() => addValue(index)}
                            className="px-2 py-1 transition-all duration-300 text-blue-500"
                          >
                            <PlusCircle className="w-5 h-5 " />
                          </button>
                        </div>

                        {/* Show Valuws */}
                        <div className="flex items-center gap-2 mt-2">
                          {property.value.map((value, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 transition-all duration-300 text-blue-500 rounded-md"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Add New Property */}
                    <div className="flex items-center gap-2 mt-1">
                      <Controller
                        name={`CustomProperties`}
                        control={control}
                        render={({ field }) => {
                          return (
                            <Input
                              type="text"
                              placeholder="Enter Property Name ..."
                              value={newLabel}
                              onChange={(e) => setNewLabel(e.target.value)}
                            />
                          );
                        }}
                      />

                      <button
                        type="button"
                        onClick={addProperty}
                        className="px-2 py-1 transition-all duration-300 text-blue-500"
                      >
                        <PlusCircle className="w-5 h-5 " />
                      </button>
                    </div>
                  </div>

                  {errors?.CustomProperties && (
                    <span className="text-red-500 text-sm">
                      {errors.CustomProperties.message as string}
                    </span>
                  )}
                </div>
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CustomProperties;
