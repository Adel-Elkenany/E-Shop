import Stop from "apps/seller-ui/src/assets/svgs/stop";
import { Trash2, X } from "lucide-react";
import React from "react";

const DeleteDiscountCodeModal = ({
  discount,
  onClose,
  onConfirm,
}: {
  discount: any;
  onClose: (e: boolean) => void;
  onConfirm?: any;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 bg-opacity-70 flex items-center justify-center transform transition-in-out duration-300">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[500px] ">
       <div className="flex justify-between items-center border-b border-gray-600 pb-2">
              <h2 className="text-lg font-semibold font-Poppins">
                Delete Discount Code
              </h2>
              <button
                onClick={() => onClose(false)}
                className="text-gray-200 hover:text-gray-400"
              >
                <X className="w-5 h-5 cursor-pointer text-red-500 border rounded-full p-1 bg-red-300 hover:bg-red-400 hover:text-white" />
              </button>
            </div>
             
            <div className="mt-4">
            <h5 className="flex flex-col items-center gap-2 text-gray-200 font-semibold font-Poppins">
              <Stop />
              Are you sure you want to delete this discount code?
            </h5>
            <div className="flex justify-end mt-6 gap-2">
            <button
            onClick={() => onClose(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
             <X className="w-5 h-5" />
            Cancel
            </button>
            <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
             <Trash2 className="w-5 h-5" />
            Delete
            </button>
            </div>
            </div>

      </div>
    </div>
  );
};

export default DeleteDiscountCodeModal;
