'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState, useEffect } from 'react' // 👈 أضفنا useEffect
import { useForm } from "react-hook-form"
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast"

type FormData = {
  email: string;
  password: string;
  newPassword?: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!canResend && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [canResend, timer]);

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        { email }
      )
      return response.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setTimer(60);
      setCanResend(false);
      reset({ email: email, password: "" });
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message: string })?.message ||
        "Failed to send OTP. Please check your email and try again.";
      setServerError(errorMessage);
    }
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail || otp.join("").length !== 4) {
        setServerError("Please enter a valid 4-digit OTP.");
        return Promise.reject(new Error("Missing email or incomplete OTP"));
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        { email: userEmail, otp: otp.join("") }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError(null);
      reset({ password: "" });
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message: string })
        ?.message;
      setServerError(errorMessage || "Invalid OTP. Try again!");
    }
  })

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!userEmail) return Promise.reject(new Error("Email is missing.")); // 💡 تأكدنا من وجود userEmail

      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        { email: userEmail, newPassword: password }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("email");
      toast.success("Password reset successfully. Please login with your new password.");
      setServerError(null);
      router.push("/login");
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message: string })
        ?.message;
      setServerError(errorMessage || "Failed to reset password, try again!");
    }
  })

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === inputRefs.current.length - 1 && newOtp.join("").length === 4) {
      verifyOtpMutation.mutate();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmitEmail = (data: FormData) => {
    requestOtpMutation.mutate({ email: data.email });
  };

  const onSubmitPassword = (data: FormData) => {
    resetPasswordMutation.mutate({ password: data.password! });
  };

  return (
    <div className='w-full py-10 min-h-[85vh] bg-[#f1f1f1]'>
      <h1 className='text-3xl font-Poppins font-semibold text-black text-center'>
        Forgot Password
      </h1>
      <p className='text-center text-lg font-medium text-[#00000999] mb-2'>
        Home . Forgot-Password
      </p>

      <div className='w-full flex justify-center'>
        <div className='md:w-[480px] p-8 bg-white shadow rounded-lg'>
          {step === "email" && (
            <>
              <h3 className='text-2xl font-semibold font-Roboto text-center mb-2'>
                Reset Your Password
              </h3>
              <p className='text-center text-gray-500 font-semibold mb-4'>
                Go back to?{" "}
                <Link href={"/login"} className='text-blue-500'>
                  Login
                </Link>
              </p>

              <form onSubmit={handleSubmit(onSubmitEmail)}>
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

                <button
                  type='submit'
                  disabled={requestOtpMutation.isPending}
                  className='w-full text-lg font-semibold cursor-pointer bg-black text-white py-2 mt-4 rounded-lg disabled:opacity-50' // 💡 إضافة حالة الـ disabled
                >
                  {requestOtpMutation.isPending ? "Sending OTP..." : "Submit"}
                </button>
                {serverError && (
                  <p className='text-red-500 text-sm mt-2'>
                    {serverError}
                  </p>
                )}
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <h3 className='text-xl font-semibold text-center mb-4'>
                Enter OTP
              </h3>
              {userEmail && (
                <p className='text-center text-sm text-gray-600 mb-4'>
                  A 4-digit code has been sent to **{userEmail}**
                </p>
              )}
              <div className='flex justify-center gap-4'>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type='text'
                    maxLength={1}
                    className='w-12 h-12 text-center text-xl font-bold border border-gray-300 outline-none rounded-md focus:border-blue-500'
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              <button
                className='w-full mt-4 text-lg font-semibold cursor-pointer bg-blue-500 text-white py-2 rounded-lg disabled:opacity-50'
                disabled={verifyOtpMutation.isPending || otp.join("").length !== 4}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>

              <div className='text-center mt-4'>
                {canResend ? (
                  <button
                    onClick={() => {
                      if (userEmail) {
                        requestOtpMutation.mutate({ email: userEmail });
                        setCanResend(false);
                        setTimer(60);
                      }
                    }}
                    disabled={requestOtpMutation.isPending}
                    className='text-blue-500 font-medium cursor-pointer disabled:text-gray-400'
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className='text-sm text-gray-600'>
                    Resend OTP in **{timer}s**
                  </p>
                )}
              </div>

              {serverError && (
                <p className='text-red-500 text-sm mt-2 text-center'>{serverError}</p>
              )}
            </>
          )}

          {step === "reset" && (
            <>
              <h3 className='text-2xl font-semibold font-Roboto text-center mb-2'>
                Set New Password
              </h3>
              <form onSubmit={handleSubmit(onSubmitPassword)}>
                <label className='block text-gray-700 mb-1 font-semibold'>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                  {...register("password", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className='text-red-500 text-sm'>
                    {String(errors.password.message)}
                  </p>
                )}
                <button
                  type='submit'
                  disabled={resetPasswordMutation.isPending}
                  className='w-full text-lg font-semibold cursor-pointer bg-black text-white py-2 mt-4 rounded-lg disabled:opacity-50'
                >
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </button>
                {serverError && (
                  <p className='text-red-500 text-sm mt-2'>
                    {serverError}
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword