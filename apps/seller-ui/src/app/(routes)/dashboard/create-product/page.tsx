"use client";
import ImagePlaceholder from "apps/seller-ui/src/shared/components/image-placeholder";
import { ChevronRightIcon } from "lucide-react";
import Input from "packages/components/inputs";
import ColorSelector from "packages/components/color-selector";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImage = [...images];
    updatedImage[index] = file;

    if (index === images.length - 1 && images.length < 10) {
      updatedImage.push(null);
    }
    setImages(updatedImage);
    setValue("images", updatedImage);
  };

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => {
      let updatedImages = [...prevImages];

      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      return updatedImages;
    });
    setValue("images", images);
  };

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-gray-200"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Heading & Breadcrumb */}
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold font-Poppins border-b mb-2 py-2 w-content">
          Create Product
        </h2>
      </div>
      <div className="flex items-center mt-2">
        <span className="text-[#80deea] cursor-pointer hover:text-[#8df2ff] hover:scale-105 transition-all duration-300">
          Dashboard{" "}
        </span>
        <ChevronRightIcon className="w-5 h-5 text-[#80deea] cursor-pointer hover:text-[#8df2ff] hover:scale-105 transition-all duration-300" />
        <span className="text-[#80deea] cursor-pointer hover:text-[#8df2ff] hover:scale-105 transition-all duration-300">
          Create Product
        </span>
      </div>

      {/* Content Layout */}
      <div className="py-4 w-full flex gap-6">
        {/* Left side - image upload section*/}
        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceholder
              setOpenImageModal={setOpenImageModal}
              size="765 x 850"
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleImageRemove}
            />
          )}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {images.slice(1).map((_, index) => (
              <ImagePlaceholder
                setOpenImageModal={setOpenImageModal}
                size="765 x 850"
                key={index}
                small={true}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleImageRemove}
              />
            ))}
          </div>
        </div>

        {/* Right side - form inputs */}
        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            {/* Product Details */}
            <div className="w-2/4">
              {/* Product title input */}
             <div>
               <Input
                label={"Product Title" + " " + "*"}
                placeholder="Enter Product Title"
                {...register("title", {
                  required: "Product title is required",
                })}
              />
              {errors.title && (
                <span className="text-red-500 text-sm">
                  {errors.title.message as string}
                </span>
              )}
             </div>
              {/* Product description input */}
              <div className="mt-4">
                <Input
                  label={"Product Description" + " " + "*"}
                  placeholder="Enter Product Description"
                  {...register("description", {
                    required: "Product description is required",
                  })}
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description.message as string}
                  </span>
                )}
              </div>

              {/* Product Tags input */}
              <div className="mt-4">
                <Input
                  label={"Product Tags" + " " + "*"}
                  placeholder="Enter Product Tags"
                  {...register("tags", {
                    required: "Product tags is required",
                  })}
                />
                {errors.tags && (
                  <span className="text-red-500 text-sm">
                    {errors.tags.message as string}
                  </span>
                )}
              </div>

              {/* Product Warranty input */}
              <div className="mt-4">
                <Input
                  label={"Product Warranty" + " " + "*"}
                  placeholder="1 Year / No Warranty"
                  {...register("warranty", {
                    required: "Product warranty is required",
                  })}
                />
                {errors.warranty && (
                  <span className="text-red-500 text-sm">
                    {errors.warranty.message as string}
                  </span>
                )}
              </div>

              {/* Product Slug input */}
              <div className="mt-4">
                <Input
                  label={"Product Slug" + " " + "*"}
                  placeholder="Enter Product Slug"
                  {...register("slug", {
                    required: "Product slug is required",
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: "Invalid slug format! Use only lowercase letters and numbers.",
                    },
                    minLength: {
                      value: 3,
                      message: "Slug must be at least 3 characters long.",
                    },
                    maxLength: {
                      value: 50,
                      message: "Slug must be at most 50 characters long.",
                    },
                  })}
                />
                {errors.slug && (
                  <span className="text-red-500 text-sm">
                    {errors.slug.message as string}
                  </span>
                )}
              </div>

              {/* Brand */}
              <div className="mt-4">
                <Input
                  label={"Brand" + " " + "*"}
                  placeholder="Enter Brand"
                  {...register("brand", {
                    required: "Brand is required",
                  })}
                />
                {errors.brand && (
                  <span className="text-red-500 text-sm">
                    {errors.brand.message as string}
                  </span>
                )}
              </div>

              {/* Color */} 
              <div className="mt-4">
                <ColorSelector control={control} errors={errors} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
