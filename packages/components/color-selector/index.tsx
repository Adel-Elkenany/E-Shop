import { useState } from "react";
import { Controller } from "react-hook-form";
import { Plus } from "lucide-react";

const defaultColors = [
  "#000000", // black
  "#FFFFFF", // white
  "#FF0000", // red
  "#00FF00", // green
  "#0000FF", // blue
  "#FFFF00", // yellow
  "#FF00FF", // purple
  "#00FFFF", // cyan
];

const ColorSelector = ({ control, errors }: any) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState("#ffffff");

  return (
    <div className="mt-2">
      <label className="block text-sm font-semibold text-gray-300 mb-1">
        Colors
      </label>
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-3">
            {[...defaultColors, ...customColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ["#ffffff", "#ffff00"].includes(color);

              return (
                <button
                  type="button"
                  key={color}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((c: string) => c !== color)
                        : [...(field.value || []), color]
                    )
                  }
                  className={`w-6 h-6 rounded-full p-2 my-1 flex items-center justify-center border border-gray-600 hover:shadow-sm hover:shadow-[#80deea] transition-all duration-300 
                  ${isSelected ? "scale-110 border-white" : "border-black"} 
                  ${isLightColor ? "border-2 border-gray-600" : ""}`}
                  style={{ backgroundColor: color }}
                />
              );
            })}

            {/* Add new color */}
            <div>
              <button
              type="button"
              onClick={() => setShowColorPicker(true)}
              className="w-6 h-6 rounded-full p-2 my-1 flex items-center justify-center hover:shadow-sm hover:shadow-[#80deea]
              border border-gray-600 bg-gray-800 hover:bg-gray-700 transition-all duration-300"
            >
              <Plus className="w-4 h-4 text-gray-200" />
            </button>

            {/* Color picker */}
            {showColorPicker ? (
              <div className="absolute z-10 bg-gray-800 p-2 rounded-md flex items-center justify-center gap-1 shadow-lg">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-10 h-10 bg-gray-800 cursor-pointer"
                />
                <button 
                type="button"
                onClick={() => {
                  setCustomColors([...customColors, newColor]);
                  setShowColorPicker(false);
                  setNewColor("#ffffff");
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm gap-2"
                >
                  Add
                </button>
              </div>
            ) : null}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default ColorSelector;
