'use client'

import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { countries } from 'apps/seller-ui/src/utils/countries';
import CreateShop from 'apps/seller-ui/src/shared/modules/auth/create-shop';
import StripeLogo from 'apps/seller-ui/src/assets/svgs/Stripe-logo';

const Signup = () => {
 const [activeStep, setActiveStep] = useState(1);
 const [passwordVisible, setPasswordVisible] = useState(false);
 const [canReset, setCanReset] = useState(true);
 const [showOtp, setShowOtp] = useState(false);
 const [timer, setTimer] = useState(60);
 const [otp, setOtp] = useState(["", "", "", ""]);
 const [sellerData, setSellerData] = useState<FormData | null>(null);
 const [sellerId, setSellerId] = useState("");
 const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

 const {
  register,
  handleSubmit,
  formState: { errors },
 } = useForm();

 const startResendTimer = () => {
  const interVal = setInterval(() => {
   setTimer((prev) => {
    if (prev <= 1) {
     clearInterval(interVal);
     setCanReset(true);
     return 0;
    }
    return prev - 1;
   })
  }, 1000)
 }

 const signupMutation = useMutation({
  mutationFn: async (data: FormData) => {
   const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/seller-registration`,
    data
   );
   return response.data;
  },
  onSuccess: (_, formData) => {
   setSellerData(formData);
   setShowOtp(true);
   setCanReset(false);
   setTimer(60);
   startResendTimer();
  },
  onError: (error) => {
   console.log("Signup Error:", error);
  }
 });

 const verifyOtpMutation = useMutation({
  mutationFn: async () => {
   if (!sellerData) return;
   const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-seller`, {
    ...sellerData,
    otp: otp.join(""),
   }
   )
   return response.data;
  },
  onSuccess: (data) => {
   setSellerId(data?.seller?.id)
   setActiveStep(2);
  }
 })

 const onSubmit = (data: any) => {
  signupMutation.mutate(data);
 };

 const handleOtpChange = (index: number, value: string) => {
  if (!/^[0-9]?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < inputRefs.current.length - 1) {
   inputRefs.current[index + 1]?.focus();
  }
 };

 const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Backspace' && !otp[index] && index > 0) {
   inputRefs.current[index - 1]?.focus();
  }
 }

 const resendOtp = () => {
  if (sellerData) {
   signupMutation.mutate(sellerData);
  }
 };

 const connectStripe = async () => {
  try {
   const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-stripe-link`,
    { sellerId }
   )

   if (response.data.url) {
    window.location.href = response.data.url;
   }
  } catch (error) {
   console.log("Stripe Connect Error", error)
  }
 }

 return (
  <div className='w-full flex flex-col bg-w items-center pt-10 min-h-screen'>
   {/* Stepper */}
   <div className='relative flex items-center justify-between mb-8 md:w-1/2'>
    <div className='absolute top-1/4 left-0 w-[80%] md:w-[90%] h-1 bg-gray-300  -z-10' />
    {[1, 2, 3].map((step) => (
     <div key={step}>
      <div className={`w-10 h-10 border-4 shadow-md mb-2 flex text-center items-center justify-center rounded-full text-white text-lg font-bold 
       ${step <= activeStep ? "bg-blue-600" : "bg-gray-300"
       }`}>
       {step}
      </div>
      <span className='ml-[-20px] font-semibold'>
       {step === 1
        ? "Create Account"
        : step === 2
         ? "Setup Shop"
         : "Connect Bank"}
      </span>
     </div>
    ))}
   </div>

   {/* Steps content */}
   <div className='md:w-[480px] p-8 bg-white shadow rounded-lg'>

    {/* Step 1 */}
    {activeStep === 1 && (
     <>
      {!showOtp ? (
       <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className='text-2xl font-Poppins font-semibold text-black text-center m'>
         Create Account
        </h1>
        <label className='text-gray-700 mb-1 font-semibold'>Name:</label>
        <input
         type='text'
         placeholder='Enter your name'
         className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
         {...register("name", {
          required: "Name is required",
         })}
        />
        {errors.email && (
         <p className='text-red-500 text-sm'>
          {String(errors.email.message)}
         </p>
        )}

        <label className='text-gray-700 mb-1 font-semibold'>Email:</label>
        <input
         type='email'
         placeholder='support@eshop.com'
         className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
         {...register("email", {
          required: "Email is required",
          pattern: {
           value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
           message: "Please enter a valid email address",
          }
         })}
        />
        {errors.email && (
         <p className='text-red-500 text-sm'>
          {String(errors.email.message)}
         </p>
        )}

        <label className='text-gray-700 mb-1 font-semibold'>Phone Number:</label>
        <input
         type='tel'
         placeholder='+2 012 123 1234'
         className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
         {...register("phone_number", {
          required: "Phone Number is required",
          pattern: {
           value: /^\+?[1-9]\d{1,14}$/,
           message: "Invalid phone number format!",
          },
          minLength: {
           value: 10,
           message: "Phone number must be at least 10 digits",
          },
          maxLength: {
           value: 15,
           message: "Phone number cannot exceed 15 digits",
          }
         })}
        />
        {errors.phone_number && (
         <p className='text-red-500 text-sm'>
          {String(errors.phone_number.message)}
         </p>
        )}

        <label className='text-gray-700 mb-1 font-semibold'>Country:</label>
        <select
         className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
         {...register("country", {
          required: "Country is required",
         })}
        >
         <option value="">Slect your Country</option>
         {countries.map((country) => (
          <option key={country.code} value={country.code} className='outline-0'>
           {country.name}
          </option>
         ))}
        </select>
        {errors.country && (
         <p className='text-red-500 text-sm'>
          {String(errors.country.message)}
         </p>
        )}

        <label className='text-gray-700 mb-1 font-semibold'>Password:</label>
        <div className='relative'>
         <input
          type={passwordVisible ? "text" : "password"}
          placeholder="min. 8 characters"
          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
          {...register("password", {
           required: "Password is required",
           minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
           },
          })}
         />

         <button
          type='button'
          onClick={() => setPasswordVisible(!passwordVisible)}
          className='absolute inset-y-0 right-3 flex items-center text-gray-400'
         >
          {passwordVisible ? <Eye /> : <EyeOff />}
         </button>
         {errors.password && (
          <p className='text-red-500 text-sm'>
           {String(errors.password.message)}
          </p>
         )}
        </div>
        <button type='submit'
         disabled={signupMutation.isPending}
         className='w-full mt-4 text-lg font-semibold cursor-pointer bg-black text-white py-2 rounded-lg'
        >
         {signupMutation.isPending ? " signing up ... " : "Signup"}
        </button>

        {signupMutation.isError &&
         signupMutation.error instanceof AxiosError && (
          <p className='text-red-500 text-sm mt-2'>
           {signupMutation.error.response?.data.message
            || signupMutation.error.message}
          </p>
         )}
        <p
         className='pt-3 text-center'>
         Already have an account? {" "}
         <Link href={"/login"} className='text-blue-500'>Login</Link>
        </p>
       </form>
      ) : (
       <div>
        <h3 className='text-xl font-semibold text-center mb-4 '>Enter OTP</h3>
        <div className='flex justify-center gap-6'>
         {otp?.map((digit, index) => (
          <input type='text' key={index} ref={(el) => {
           if (el) inputRefs.current[index] = el;
          }}
           maxLength={1}
           className='w-12 h-12 text-center border border-gray-300 outline-none'
           value={digit}
           onChange={(e) => handleOtpChange(index, e.target.value)}
           onKeyDown={(e) => handleOtpKeyDown(index, e)}
          />
         ))}
        </div>
        <button
         className='w-full mt-4 text-lg font-semibold cursor-pointer bg-blue-500 text-white py-2 rounded-lg'
         disabled={verifyOtpMutation.isPending}
         onClick={() => verifyOtpMutation.mutate()}
        >
         {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
        </button>
        <p className='text-center text-sm mt-4'>
         {canReset ? (
          <button
           onClick={resendOtp}
           className='text-blue-500 font-medium cursor-pointer'
          >
           Reset OTP
          </button>
         ) : (
          `Reset OTP in ${timer}s`
         )}
        </p>
        {verifyOtpMutation?.isError &&
         verifyOtpMutation.error instanceof AxiosError && (
          <p className='text-red-500 text-sm mt-2'>
           {verifyOtpMutation.error.response?.data.message
            || verifyOtpMutation.error.message}
          </p>
         )}
       </div>
      )}
     </>
    )}

    {/* Step 2 */}
    {activeStep === 2 && (
     <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
    )}

    {/* Step 3 */}
    {activeStep === 3 && (
     <div className='text-center'>
      <h3 className='text-2xl font-semibold'>Withdraw</h3>
      <hr />
      <button
       className='w-full m-auto flex items-center justify-center gap-3 text-lg bg-gray-700 text-white py-3 rounded-lg'
       onClick={connectStripe}
      >
       Connect Stripe <StripeLogo />
      </button>
     </div>
    )}
   </div>
  </div >
 )
}

export default Signup