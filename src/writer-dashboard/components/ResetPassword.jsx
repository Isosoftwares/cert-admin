import { useMutation } from "@tanstack/react-query";
import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

function ResetPassword({ userId, handleCloseResetPassword, userType, name }) {
  const axios = useAxiosPrivate();

  const resetPassword = (data) => {
    return axios.post(`/users/reset/password`, data);
  };

  const { mutate: resetMutate, isLoading: loadingReset, error } = useMutation(
    resetPassword,
    {
      onSuccess: (response) => {
        const text = response?.data?.message;
        toast.success(text);
        handleCloseResetPassword();
      },
      onError: (err) => {
        const text = err?.response?.data?.message || "something went wrong";
        toast.warn(text);
      },
    }
  );


  return (
    <div>
      <div>
        <p>Are you sure you want to reset password for  <span className="font-bold" >{name} </span></p>
        <p className="text-gray-600 text-sm   ">NOTE: Password will be reset to the user current phone number </p>
      </div>
      <div className="flex gap-4 justify-center items-center mt-5  mb-5 h-[30px]">
        <button
        disabled={loadingReset}
          className="px-4 py-1 bg-primary text-light rounded-md shadow-md shadow-cyan-100 "
          onClick={() => {
            resetMutate({ userType, userId });
          }}
        >
          Yes, Reset
        </button>
        <button
          className="px-4 py-1 bg-gray-700 text-light rounded-md shadow-md shadow-cyan-100 "
          onClick={() => {
            handleCloseResetPassword();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
