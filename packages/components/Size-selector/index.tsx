import { Controller } from "react-hook-form";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"]

const SizeSelector = ({ control }: { control: any }) => {
    return (
     <div className="mt-4">
        <label className="block text-sm font-medium text-gray-200 mb-3">Sizes</label>
        <Controller
            control={control}
            name="sizes"
            render={({ field }) => (
                <div className="flex gap-2">
                    {sizes.map((size) => {
                      const currentValues = (field.value || []) as string[];
                      const isSelected = currentValues.includes(size);
                      return (
                        <button
                          type="button"
                          key={size}
                          className={`px-4 py-2 border border-gray-600 rounded-md transition-colors duration-200 
                            ${isSelected 
                              ? "bg-blue-600 text-black font-semibold" 
                              : "bg-black text-gray-300 hover:bg-gray-800"}`}
                          onClick={() => {
                             const newValues = isSelected
                                ? currentValues.filter((s: string) => s !== size)
                                : [...currentValues, size];
                             field.onChange(newValues);
                          }}
                        >
                          {size}
                        </button>
                      );
                    })}
                </div>
            )}
        />
     </div>
    )
}

export default SizeSelector
