import { Pencil, WandSparkles, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ImagePlaceholder = ({
  size,
  small,
  onImageChange,
  onRemove,
  defaultImage = null,
  index = null,
  setOpenImageModal,
}: {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove?: (index: number) => void;
  defaultImage?: string | null;
  setOpenImageModal: (setOpenImageModal: boolean) => void;
  index?: any;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file, index);
    }
  };

  return (
    <div
      className={`relative ${small ? "h-[120px] w-[120px]" : "h-[250px] w-[250px]"}
      w-full cursor-pointer hover:shadow-sm hover:shadow-[#80deea] transition-all duration-300 bg-black border-[1px] border-gray-600 rounded-lg 
      flex flex-col items-center justify-center
    `}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`image-upload-${index}`}
        onChange={handleImageChange}
      />
      {imagePreview ? (
        <>
          <button
            type="button"
            onClick={() => onRemove && onRemove(index)}
            className="absolute top-3 right-3 p-2 cursor-pointer bg-red-500 rounded-full shadow-md"
          >
            <X size={12} />
          </button>
          <button
            type="button"
            onClick={() => setOpenImageModal(true)}
            className="absolute top-3 right-12 p-2 cursor-pointer bg-blue-500 rounded-full shadow-md"
          >
            <WandSparkles size={12} />
          </button>
        </>
      ) : (
        <label
          className="absolute bg-slate-700 p-1 top-5 right-0 hover:bg-slate-600 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          htmlFor={`image-upload-${index}`}
        >
          <Pencil size={12} />
        </label>
      )}

      {imagePreview ? (
        <Image
          src={imagePreview}
          alt="Image Preview"
          width={150}
          height={150}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <>
          <p
            className={`text-gray-400 ${
              small ? "text-xl" : "text-2xl"
            } font-semibold`}
          >
            {size}
          </p>
          <p className={`text-gray-500 ${small ? "text-sm" : "text-md"} pt-1 font-semibold`}>
            Choose Image
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePlaceholder;
