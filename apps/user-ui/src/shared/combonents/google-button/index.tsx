import React from "react";

const GoogleButton = () => {
 return (
  <div className="w-full flex justify-center">
   <button
    className="flex items-center gap-3 shadow-sm border border-gray-300 px-4 py-2 rounded-lg
             hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white"
   >
    <svg
     xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 48 48"
     className="w-5 h-5"
    >
     <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8
      -6.9 0-12.5-5.6-12.5-12.5S17.1 11 24 11c3.1 0 5.9 1.1 8.1 3.1l5.7-5.7C34.2 4.5 29.4 2.5 24 2.5 12.7 2.5 3.5 11.7 3.5 23S12.7 43.5 24 43.5
      44.5 34.3 44.5 23c0-1.3-.1-2.5-.4-3.6z"
     />
     <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.4 16.2 18.8 13 24 13c3.1 0 5.9 1.1 8.1 3.1l5.7-5.7C34.2 4.5 29.4 2.5 24 2.5
      15.8 2.5 8.7 7.3 6.3 14.7z"
     />
     <path
      fill="#4CAF50"
      d="M24 43.5c5.3 0 10.2-2.0 13.6-5.4l-5.9-5.6c-2 1.5-4.7 2.5-7.7 2.5
      -5.2 0-9.6-3.3-11.3-7.9l-6.5 4.9C8.8 38.8 15.9 43.5 24 43.5z"
     />
     <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.7 2.1-1.9 4-3.6 5.4l-.1.1 5.9 5.6
      .2-.2C41.8 34.5 44.5 29 44.5 23c0-1.3-.1-2.5-.4-3.6z"
     />
    </svg>

    <span className="text-gray-700 font-medium">Continue with Google</span>
   </button>

  </div>
 );
};

export default GoogleButton;
