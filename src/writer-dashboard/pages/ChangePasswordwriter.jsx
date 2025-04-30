import React, { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Loader } from "@mantine/core";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import usePrimaryColor from "../../hooks/usePrimaryColor";
import { Helmet } from "react-helmet-async";

function ChangePassword() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const [visiblePassword, setVisiblePassword] = useState(false);
  const bgPrimary = usePrimaryColor();

  // password change
  // password form validation rules
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;

  const changePassword = (data) => {
    return axios.patch(`/auth/change-password`, data);
  };

  const {
    mutate: changePassMutate,
    isLoading: loadingChangePass,
  } = useMutation(changePassword, {
    onSuccess: (response) => {
      const text = response?.data?.message;
      toast.success(text);
      reset();
    },
    onError: (err) => {
      const text = err?.response?.data?.message || "something went wrong";
      toast.error(text);
    },
  });

  const handlePasswordChange = (data) => {
    data.userType = "user";
    data.userId = auth?.userId;
    changePassMutate(data);

  };

  //end of password change
  return (
    <div className=" py-4 px-2 mt-3 ">
      <div className="mb-5"></div>
      <div className="bg-white flex flex-col shadow pt-2 ">
        <div>
          <div className="flex gap-8   px-4 mb-2">
            <div>
              <h1 className="text-sm  text-gray-500">Back to Profile</h1>
              <h1 className=" text-xl text-blue-500 md:text-lg font-bold tracking-wide ">
                Change Password
              </h1>
            </div>
          </div>
        </div>
        <hr />
        <br />
        <div className="flex justify-center mt-3">
          <div className=" w-full px-2 md:px-4 mb-5 md:w-[50%] ">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="flex gap-2 flex-col">
                <div className="mb-5">
                  <h1 className="mb-2">
                    New Password{" "}
                    <span>
                      <sup className="text-red-500">*</sup>
                    </span>
                  </h1>
                  <div
                    className={` ${errors?.password && " border-red-500"} ${
                      loadingChangePass && " bg-gray-200"
                    } flex gap-3 p-2 border border-gray-300 rounded-md `}
                  >
                    <input
                      type={visiblePassword ? "text" : "password"}
                      {...register("password")}
                      name="password"
                      placeholder="Enter New Password"
                      className="outline-none w-full bg-white bg-opacity-100 disabled:bg-gray-200 "
                      disabled={loadingChangePass}
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
                  <p className="text-red-500 text-sm">
                    {errors.password?.message}
                  </p>
                </div>
                <div className="mb-5">
                  <h1 className="mb-2">
                    Confirm Password{" "}
                    <span>
                      <sup className="text-red-500">*</sup>
                    </span>{" "}
                  </h1>
                  <div
                    className={` ${
                      errors?.confirmPassword && " border-red-500"
                    } ${
                      loadingChangePass && " bg-gray-200"
                    } flex gap-3 p-2 border border-gray-300 rounded-md `}
                  >
                    <input
                      type={visiblePassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      name="confirmPassword"
                      placeholder="Repeat New Password"
                      className={`outline-none w-full bg-white bg-opacity-100 disabled:bg-gray-200 `}
                      disabled={loadingChangePass}
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
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword?.message}
                  </p>
                </div>
                <div className="my-5 flex justify-center">
                  <button
                    disabled={loadingChangePass}
                    onClick={handleSubmit(handlePasswordChange)}
                    className={` ${bgPrimary} rounded-md text-white   bg-opacity-100 hover:bg-opacity-80 cursor-pointer  duration-300   px-4 py-2 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-opacity-70 `}
                  >
                    {loadingChangePass ? "Updating" : "Change password"}
                    {loadingChangePass ? (
                      <Loader color="white" size={22} />
                    ) : (
                      ""
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
