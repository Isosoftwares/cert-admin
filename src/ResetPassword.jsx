import React, { useState } from "react";
import NavBar from "./components/NavBar";
import Footer from "./website/components/Footer";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "./api/axios";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import { Loader } from "@mantine/core";
import { Helmet } from "react-helmet-async";

const ResetPassword = () => {
  const { userType, userId, resetString } = useParams();

  const [visiblePassword, setVisiblePassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const resetPassword = (data) => {
    return axios.patch("/reset-password", data);
  };

  const {
    mutate: resetPasswordMutate,
    isLoading: resetPasswordLoading,
    error,
  } = useMutation(resetPassword, {
    onSuccess: (response) => {
      reset();
      toast.success(response.data.message);
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      const text = err?.response.data.message || "something went wrong";

      toast.error(text);
    },
  });

  const onSubmitting = (data) => {
    data.userType = userType;
    data.userId = userId;
    data.resetString = resetString;

    // Call the API to update the password.
    resetPasswordMutate(data);
  };

  //   get email verification
  const getResetPassword = () => {
    return axios.get(`/reset-password/${userId}`);
  };

  const {
    isLoading: loadingResetPassword,
    data: resetPasswordData,
    refetch,
  } = useQuery([`reset-${userId}`, userId], getResetPassword, {
    enabled: !!userId,
  });

  console.log("expires at", new Date(resetPasswordData?.data?.expiresAt) >
  (new Date() - 3 * 60 * 60 * 1000))

  console.log("date1", resetPasswordData?.data?.expiresAt)
  console.log("date2", new Date() - 3 * 60 * 60 * 1000)

  return (
    <div>
      <Helmet>
        <title>Reset Password | My Content Way</title>
      </Helmet>
      <div className="min-h-[80vh]  bg-blue-200 flex items-center justify-center">
        <NavBar />

        <div className="bg-white mt-16 px-8 py-6 md:w-[40%] rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
          {loadingResetPassword ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : !resetPasswordData || resetPasswordData?.data?.message ? (
            <div>
              <p className="text-gray-700 mb-5">
                This link has
                <span className="text-red-500 font-bold"> EXPIRED</span>, or has
                already been used to
                <span className="text-red-500 font-bold uppercase">
                  reset your password
                </span>
                .
              </p>
              <p className="italics">
                <span>NOTE:</span>
                <i>If this was not you, please contact support.</i>
              </p>
            </div>
          ) : (
            (new Date(resetPasswordData?.data?.expiresAt) <
              (Date.now() - 3 * 60 * 60 * 1000) ))? (
            <div>
              <p className="text-gray-700 mb-5">
                This link has
                <span className="text-red-500 font-bold"> EXPIRED</span>, or has
                already been used to
                <span className="text-red-500 font-bold uppercase">
                &nbsp; reset your password
                </span>
                .
              </p>
              <p className="italics">
                <span>NOTE:</span>
                <i>If this was not you, please contact support.</i>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitting)}>
              <div className="">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-1"
                >
                  New Password
                </label>
                <div
                  className={` ${
                    errors?.password && " border-red-500"
                  }  flex gap-3 p-2 items-center border border-gray-300 rounded-md `}
                >
                  <input
                    type={visiblePassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full p-  outline-none "
                    placeholder="Enter your new password"
                    {...register("password", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <h1>
                    {visiblePassword ? (
                      <div
                        className="px-2 cursor-pointer"
                        onClick={() => {
                          setVisiblePassword(!visiblePassword);
                        }}
                      >
                        <AiOutlineEyeInvisible />
                      </div>
                    ) : (
                      <div
                        className="px-2 cursor-pointer"
                        onClick={() => {
                          setVisiblePassword(!visiblePassword);
                        }}
                      >
                        <AiOutlineEye />
                      </div>
                    )}
                  </h1>
                </div>
              </div>
              <p className="text-red-500 text-sm">{errors.password?.message}</p>

              <div className="mt-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-gray-700 font-bold mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type={visiblePassword ? "text" : "password"}
                  {...register("password")}
                  className={` ${
                    errors?.confirmPassword && " border-red-500"
                  } w-full p-2 border outline-none border-gray-300 rounded-md `}
                  placeholder="Confirm your new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") ||
                      "The passwords do not match",
                  })}
                />
              </div>
              <p className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </p>

              {resetPasswordLoading ? (
                <div className="flex justify-center items-center pt-4">
                  <Loader color="yellow" />
                </div>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-500 mt-4 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
                >
                  Reset Password
                </button>
              )}
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
