"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "apps/seller-ui/src/utils/axiosinstance";
import { AxiosError } from "axios";
import { ChevronRightIcon, Pencil, Plus, Trash2, X } from "lucide-react";
import Input from "packages/components/inputs";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [discountId, setDiscountId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: discountCodes = [], isLoading } = useQuery({
    queryKey: ["shop-discounts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-discount-codes");
      return res.data.discountCodes || [];
    },
  });

  const editDiscount = (id: string) => {
    setShowModal(true);
    setDiscountId(id);
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      publicName: "",
      discountType: "percentage",
      discountValue: "",
      discountCode: "",
    },
  });

  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data: any) => {
      await axiosInstance.post("/product/api/create-discount-code", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discounts"] });
      reset();
      setShowModal(false);
    },
  });

  const deleteDiscountCodeMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/product/api/delete-discount-code/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-discounts"] });
      toast.success("Discount code deleted successfully");
      setDiscountId("");
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete discount code");
    }
  });

  const deleteDiscount = (id: string) => {
    if(window.confirm("Are you sure you want to delete this discount code?")){
        deleteDiscountCodeMutation.mutate(id);
    }
  };

  const onSubmit = (data: any) => {
    if (discountCodes.length >= 8) {
      toast.error("You can't create more than 8 discount codes");
      return;
    }
    createDiscountCodeMutation.mutate(data);
  };

  return (
    <div className="w-full min-h-screen p-8 text-gray-200">
      {/* Heading & Breadcrumb */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold font-Poppins border-b mb-2 py-2 w-content">
          Discount Codes
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 font-semibold rounded-md ml-2 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Create Discount Code
        </button>
      </div>
      <div className="flex items-center mt-2">
        <span className="text-[#80deea] cursor-pointer hover:text-[#8df2ff] hover:scale-105 transition-all duration-300">
          Dashboard{" "}
        </span>
        <ChevronRightIcon className="w-5 h-5 text-[#80deea] cursor-pointer hover:text-[#8df2ff] hover:scale-105 transition-all duration-300" />
        <span className="text-[#80deea] cursor-pointer hover:text-[#8df2ff] hover:scale-105 transition-all duration-300">
          Discount Codes
        </span>
      </div>

      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg pb-6 text-gray-200 font-semibold font-Poppins">
          Your Discount Codes
        </h3>
        {isLoading ? (
          <p className="text-gray-200 text-center font-semibold font-Poppins">
            Loading...
          </p>
        ) : (
          <table className="w-full text-white">
            <thead className="text-gray-200 bg-gray-800 font-semibold font-Poppins border-b shadow-lg">
              <tr className="border-b border-gray-600">
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Value</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discountCodes.map((discount: any) => (
                <tr
                  key={discount?.id}
                  className="border-b border-gray-800 hover:bg-blue-950/50 hover:shadow-md hover:shadow-slate-700 transition-all duration-300"
                >
                  <td className="px-4 py-3">{discount.publicName}</td>
                  <td className="px-4 py-3">
                    {discount.discountType === "percentage"
                      ? "Percentage %"
                      : "Flat $"}
                  </td>
                  <td className="px-4 py-3">
                    {discount.discountValue === "percentage"
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}`}
                  </td>
                  <td className="px-4 py-3">{discount.discountCode}</td>
                  <td className="px-4 py-3">
                     <button
                      disabled
                      title="Not implemented yet"
                      className="bg-indigo-600 cursor-not-allowed text-white px-2 py-2 font-semibold rounded-full ml-2 transition-all duration-300"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteDiscount(discount.id)}
                      className="bg-red-600 text-white px-2 py-2 font-semibold rounded-full ml-2 hover:bg-red-700 hover:scale-105 transition-all duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && discountCodes?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-3 pt-6  text-center font-semibold font-Poppins text-lg text-red-500"
                  >
                    No discount codes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Creat Discount Code Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 bg-opacity-70 flex items-center justify-center transform transition-in-out duration-300">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[500px] ">
            <div className="flex justify-between items-center border-b border-gray-600 pb-2">
              <h2 className="text-lg font-semibold font-Poppins">
                Create Discount Code
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-200 hover:text-gray-400"
              >
                <X className="w-5 h-5 cursor-pointer text-red-500 border rounded-full p-1 bg-red-300 hover:bg-red-400 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              {/* Title */}
              <div className="mt-2">
                <Input
                label="Title *"
                placeholder="Enter title"
                {...register("publicName", { required: "Title is required" })}
              />
              {errors.publicName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.publicName.message}
                </p>
              )}
              </div>

              {/* Discount Type */}
              <div className="mt-2">
                <label
                  htmlFor="discountType"
                  className="block text-gray-200 font-semibold font-Poppins mb-2"
                >
                  Discount Type *
                </label>
                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 text-gray-400 bg-black border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage %</option>
                      <option value="flat">Flat Amount $</option>
                    </select>
                  )}
                />
              </div>

              {/* Discount Value */}
             <div className="mt-2">
             <Input
             type="number"
             label="Discount Value *"
             placeholder="Enter discount value"
             {...register("discountValue", { required: "Discount value is required" })}
             />
             {errors.discountValue && (
               <p className="text-red-500 text-sm mt-1">
                 {errors.discountValue.message}
               </p>
             )}
             </div>

             {/* Discount Code */}
             <div className="mt-2">
             <Input
             label="Discount Code *"
             placeholder="Enter discount code"
             {...register("discountCode", { required: "Discount code is required" })}
             />
             {errors.discountCode && (
               <p className="text-red-500 text-sm mt-1">
                 {errors.discountCode.message}
               </p>
             )}
             </div>

             {/* Submit  */}
             <div className="flex justify-end mt-4">
             <button
             type="submit"
             disabled={createDiscountCodeMutation.isPending}
             className="flex justify-center items-center bg-blue-600 text-white w-full px-4 py-2 font-semibold rounded-md hover:bg-blue-700 transition-all duration-300"
             >
             <Plus className="w-5 h-5 mr-2" />
             {createDiscountCodeMutation.isPending ? "Creating..." : "Create"}
             </button>
             </div>
             {createDiscountCodeMutation.isError && (
               <p className="text-red-500 text-sm mt-1">
                 {(
                  createDiscountCodeMutation.error as AxiosError<{message: string}>
                 ).response?.data?.message || "Something went wrong"}
               </p>
             )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
