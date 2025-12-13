"use client";
import ImagePlaceholder from "apps/seller-ui/src/shared/components/image-placeholder";
import { ChevronRightIcon } from "lucide-react";
import Input from "packages/components/inputs";
import ColorSelector from "packages/components/color-selector";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomSpecifications from "packages/components/custom-specifications";
import CustomProperties from "packages/components/Custom-properties";

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
 const [isLoading, setLoading] = useState(false);
 const [categories, setCategories] = useState<string[] | null>(null);
 const [isError, setIsError] = useState(false);
 const [isInitialized, setIsInitialized] = useState(false);

 // categories will be initialized on mount (see useEffect below)

 const onSubmit = (data: any) => {
  console.log(data);
 };

 useEffect(() => {
  // Lazy load the list of shop categories from the local util and populate the select.
  // We do this on the client only.
  (async () => {
   try {
    const mod = await import("apps/seller-ui/src/utils/categories");
    const shopCategories = mod.shopCategories || [];
    setCategories(shopCategories.map((c: any) => c.value || c));
   } catch (err) {
    console.error("Failed to load categories:", err);
    setIsError(true);
   } finally {
    setIsInitialized(true);
   }
  })();
 }, []);

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
     <label className="block text-sm font-medium text-gray-200 mb-3">
      Product Images *
     </label>
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
       <div className="mt-4 mb-12">
        <ColorSelector control={control} errors={errors} />
       </div>

       {/* Specifications */}
       <div className="mt-4">
        <CustomSpecifications control={control} errors={errors} />
       </div>

       {/* Properties */}
       <div className="mt-4">
        <CustomProperties control={control} errors={errors} />
       </div>

       {/* Cash On Delivery */}
       <div className="mt-4">
        <label className="block text-sm font-medium text-gray-200">
         Cash On Delivery *
        </label>
        <select
         {...register("cash_on_delivery", {
          required: "Cash on delivery is required",
         })}
         defaultValue="yes"
         className="mt-2 block w-full bg-black rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
         <option value="yes" className="bg-black">Yes</option>
         <option value="no" className="bg-black">No</option>

        </select>
        {errors.cashOnDelivery && (
         <span className="text-red-500 text-sm">
          {errors.cashOnDelivery.message as string}
         </span>
        )}
       </div>
      </div>

      {/* Product Category & Subcategory */}
      <div className="w-2/4">
       <label className="block text-sm font-medium text-gray-200">
        Product Category *
       </label>
       {isLoading ? (
        <p className="text-gray-200 mt-2">Loading categories...</p>
       ) : isError ? (
        <p className="text-red-500 mt-2">Failed to load categories.</p>
       ) : (
        <Controller
         control={control}
         name="category"
         rules={{ required: "Product category is required" }}
         render={({ field }) => (
          <select
           {...field}
           className={`w-full border-[1px] border-gray-600 bg-black p-2 mt-3 rounded-md text-white outline-none`}
          >
           <option value="" className="bg-black">Select a category</option>
           {categories?.map((category: string) => (
            <option value={category} key={category} className="bg-black">
             {category}
            </option>
           ))}
          </select>
         )}
        />
       )}
       {errors.category && (
        <span className="text-red-500 text-sm">
         {errors.category.message as string}
        </span>
       )}

       {/* Subcategory */}
       <div className="mt-4">
        <label className="block text-sm font-medium text-gray-200">
         Product Subcategory *
        </label>
        {isLoading ? (
         <p className="text-gray-200 mt-2">Loading subcategories...</p>
        ) : isError ? (
         <p className="text-red-500 mt-2">Failed to load subcategories.</p>
        ) : (
         <Controller
          control={control}
          name="subcategory"
          rules={{ required: "Product subcategory is required" }}
          render={({ field }) => (
           <select
            {...field}
            className={`w-full border-[1px] border-gray-600 bg-black p-2 mt-3 rounded-md text-white outline-none`}
           >
            <option value="" className="bg-black">Select a subcategory</option>
            {categories?.map((subcategory: string) => (
             <option value={subcategory} key={subcategory} className="bg-black">
              {subcategory}
             </option>
            ))}
           </select>
          )}
         />
        )}
        {errors.category && (
         <span className="text-red-500 text-sm">
          {errors.category.message as string}
         </span>
        )}

       </div>
      </div>
     </div>
    </div>
  </form>
 );
};

export default Page;
