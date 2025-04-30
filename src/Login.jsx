import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { Loader, PasswordInput } from "@mantine/core";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Helmet } from "react-helmet-async";
import logo from "./assets/graphics/logo.jpg";

function Login() {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const { setAuth, persist, setPersist } = useAuth();
  const location = useLocation();
  const toDash = location.state?.from?.pathname || "/dashboard/all-records";
  const towriterDash = location.state?.from?.pathname || "/writer/overview";
  const toManagerDash = location.state?.from?.pathname || "/manager/manage-ged";
  const [visiblePassword, setVisiblePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const login = (loginData) => {
    return axios.post("/auth/login", loginData);
  };

  const { mutate: loginMutate, isLoading: loginLoading, error } = useMutation(
    login,
    {
      onSuccess: (response) => {
        reset();
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        const userId = response?.data?.user_Id;
        const name = response?.data?.name;
        const status = response?.data?.status;
        const imgUrl = response.data.imgUrl;

        setAuth({
          roles,
          accessToken,
          userId,
          name,
          status,
          imgUrl,
        });
        localStorage.setItem("userId", JSON.stringify(userId));
        const text = `Welcome back ${name || ""}`;

        toast.success(text);

        if (roles.includes("Admin") || roles.includes("SuperAdmin")) {
          navigate(toDash, { replace: true });
        } else if (roles.includes("Writer")) {
          navigate(towriterDash, { replace: true });
        } else {
          navigate(toManagerDash, { replace: true });
        }
      },
      onError: (err) => {
        const text = err?.response.data.message || "something went wrong";

        setErrMsg(text);
        setTimeout(() => {
          setErrMsg("");
        }, 10000);

        toast.error(text);
      },
    }
  );

  const onSubmitting = async (data) => {
    loginMutate(data);
  };
  return (
    <div>
      <section className="bg-[#f6f7f8] flex flex-col justify-center h-screen py-6  lg:py-[40px]  ">
        <div className="">
          <div className="w-full px-3 ">
            <div className="relative mx-auto w-[95%] md:max-w-[400px] overflow-hidden rounded-lg bg-white py-16 px-4 text-center  md:px-[18px]">
              <div className="mb-5 text-center md:mb-8">
                <h1 className="tracking-wider  text-3xl font-bold text-dark ">
                  Manage
                  <span className="tracking-wider py-2 text-3xl font-bold text-primary ">
                    Service
                  </span>{" "}
                </h1>
                <h1 className="tracking-wider  ">Welcome back! </h1>
              </div>
              <form
                onSubmit={handleSubmit(onSubmitting)}
                className="flex flex-col gap-8"
              >
                <div className="">
                  <input
                    type="text"
                    placeholder="Email or Phone Number"
                    className="border-[#E9EDF4] w-full rounded-md border  py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-blue-500 disabled:bg-gray-200 focus-visible:shadow-none"
                    {...register("email", {
                      required: true,
                    })}
                    disabled={loginLoading}
                  />
                  <p className="text-red-500 pt-1 text-start text-xs">
                    {errors.email?.type === "required" && "Email is required"}
                  </p>
                </div>

                <div className="mb-5">
                  <div
                    className={` ${errors?.password && " border-red-500"} ${
                      loginLoading && "bg-gray-200"
                    } flex items-center gap-3 p-2 border border-gray-300 rounded-md `}
                  >
                    <input
                      type={visiblePassword ? "text" : "password"}
                      {...register("password", {
                        required: true,
                      })}
                      name="password"
                      placeholder="Enter Password"
                      className="outline-none w-full bg-light bg-opacity-100 disabled:bg-gray-200"
                      disabled={loginLoading}
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
                  <p className="text-red-500 pt-1 text-start text-xs">
                    {errors.password?.type === "required" &&
                      "Password is required"}
                  </p>
                </div>

                <div className="mb-10">
                  <button
                    disabled={loginLoading}
                    className="border-blue-500 w-full cursor-pointer rounded-md border bg-blue-500 py-3 px-5 text-base text-white transition hover:bg-opacity-90 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-blue-300"
                    type="submit"
                  >
                    Login
                    {loginLoading ? <Loader color="#fff" size={20} /> : ""}
                  </button>
                </div>
              </form>

              <div>
                <span className="absolute top-1 right-1">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="1.39737"
                      cy="38.6026"
                      r="1.39737"
                      transform="rotate(-90 1.39737 38.6026)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.39737"
                      cy="1.99122"
                      r="1.39737"
                      transform="rotate(-90 1.39737 1.99122)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.6943"
                      cy="38.6026"
                      r="1.39737"
                      transform="rotate(-90 13.6943 38.6026)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.6943"
                      cy="1.99122"
                      r="1.39737"
                      transform="rotate(-90 13.6943 1.99122)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="25.9911"
                      cy="38.6026"
                      r="1.39737"
                      transform="rotate(-90 25.9911 38.6026)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="25.9911"
                      cy="1.99122"
                      r="1.39737"
                      transform="rotate(-90 25.9911 1.99122)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.288"
                      cy="38.6026"
                      r="1.39737"
                      transform="rotate(-90 38.288 38.6026)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.288"
                      cy="1.99122"
                      r="1.39737"
                      transform="rotate(-90 38.288 1.99122)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.39737"
                      cy="26.3057"
                      r="1.39737"
                      transform="rotate(-90 1.39737 26.3057)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.6943"
                      cy="26.3057"
                      r="1.39737"
                      transform="rotate(-90 13.6943 26.3057)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="25.9911"
                      cy="26.3057"
                      r="1.39737"
                      transform="rotate(-90 25.9911 26.3057)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.288"
                      cy="26.3057"
                      r="1.39737"
                      transform="rotate(-90 38.288 26.3057)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="1.39737"
                      cy="14.0086"
                      r="1.39737"
                      transform="rotate(-90 1.39737 14.0086)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="13.6943"
                      cy="14.0086"
                      r="1.39737"
                      transform="rotate(-90 13.6943 14.0086)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="25.9911"
                      cy="14.0086"
                      r="1.39737"
                      transform="rotate(-90 25.9911 14.0086)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="38.288"
                      cy="14.0086"
                      r="1.39737"
                      transform="rotate(-90 38.288 14.0086)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
                <span className="absolute left-1 bottom-1">
                  <svg
                    width="29"
                    height="40"
                    viewBox="0 0 29 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="2.288"
                      cy="25.9912"
                      r="1.39737"
                      transform="rotate(-90 2.288 25.9912)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="14.5849"
                      cy="25.9911"
                      r="1.39737"
                      transform="rotate(-90 14.5849 25.9911)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.7216"
                      cy="25.9911"
                      r="1.39737"
                      transform="rotate(-90 26.7216 25.9911)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="2.288"
                      cy="13.6944"
                      r="1.39737"
                      transform="rotate(-90 2.288 13.6944)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="14.5849"
                      cy="13.6943"
                      r="1.39737"
                      transform="rotate(-90 14.5849 13.6943)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.7216"
                      cy="13.6943"
                      r="1.39737"
                      transform="rotate(-90 26.7216 13.6943)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="2.288"
                      cy="38.0087"
                      r="1.39737"
                      transform="rotate(-90 2.288 38.0087)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="2.288"
                      cy="1.39739"
                      r="1.39737"
                      transform="rotate(-90 2.288 1.39739)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="14.5849"
                      cy="38.0089"
                      r="1.39737"
                      transform="rotate(-90 14.5849 38.0089)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.7216"
                      cy="38.0089"
                      r="1.39737"
                      transform="rotate(-90 26.7216 38.0089)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="14.5849"
                      cy="1.39761"
                      r="1.39737"
                      transform="rotate(-90 14.5849 1.39761)"
                      fill="#3056D3"
                    />
                    <circle
                      cx="26.7216"
                      cy="1.39761"
                      r="1.39737"
                      transform="rotate(-90 26.7216 1.39761)"
                      fill="#3056D3"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
