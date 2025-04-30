import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  Checkbox,
  Loader,
  MultiSelect,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import {
  FaRegDotCircle,
  FaUpload,
  FaUserAlt,
  FaIdCard,
  FaAddressCard,
  FaPhone,
  FaUniversity,
  FaCertificate,
  FaCalendarAlt,
  FaBook,
  FaLink,
} from "react-icons/fa";
import { MdEmail, MdDescription } from "react-icons/md";
import { BsFilePdf, BsFileImage } from "react-icons/bs";
import { DateInput, DatePicker } from "@mantine/dates";
import useAuth from "../../hooks/useAuth";

function EditClient() {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const [certImageFile, setCertImageFile] = useState(null);
  const [certPdfFile, setCertPdfFile] = useState(null);
  const [formReady, setFormReady] = useState(false);

  const { _id } = useParams();

  const getUser = () => {
    return axios.get(`/client/one/${_id}`);
  };

  const {
    isLoading: loadingUser,
    data: userData,
    refetch,
    isRefetching: refetchingUser,
  } = useQuery({
    queryKey: [`client-${_id}`],
    queryFn: getUser,
    keepPreviousData: true,
    enabled: !!_id,
  });

  const { client = {} } = userData?.data || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm({
    defaultValues: {
      status: "Active",
    },
  });


  // Set form values when client data is loaded
  useEffect(() => {
    if (client && Object.keys(client).length > 0) {
      const defaultValues = {
        firstName: client?.firstName || "",
        middleName: client?.middleName || "",
        lastName: client?.lastName || "",
        certification: client?.certification || "",
        courseHours: client?.courseHours || "",
        modules: client?.modules || "",
        blockChainId: client?.blockChainId || "",
        courseDescription: client?.courseDescription || "",
        graphData: {
          marks: client.graphData?.marks || 0,
          average: client.graphData?.average || 0,
          description: client.graphData?.description || "",
        },
        status: client.status || "Active",
      };
      reset(defaultValues);
      setFormReady(true);
    }
  }, [client, reset]);

  const updateFnc = (data) => {
    return axios.patch(`/client/edit/${_id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const { mutate: updateMutate, isLoading: loadingUpdate } = useMutation({
    mutationFn: updateFnc,
    onSuccess: (response) => {
      setCertImageFile(null);
      setCertPdfFile(null);
      const text = response?.data?.message || "Client updated successfully";
      toast.success(text);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: [`client-${_id}`] });
    },
    onError: (err) => {
      const text = err.response?.data?.message || "An error occurred";
      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
    const formData = new FormData();

    // Add the lastUpdatedBy field
    formData.append("lastUpdatedBy", auth.userId);
    formData.append("certification", data.certification);
    formData.append("courseHours", data.courseHours);
    formData.append("modules", data.modules);
    formData.append("blockChainId", data.blockChainId);
    formData.append("courseDescription", data.courseDescription);
    formData.append("issuedOn", data.issuedOn);
    formData.append("expiresOn", data.expiresOn);
    formData.append("firstName", data.firstName);
    formData.append("middleName", data.middleName);
    formData.append("lastName", data.lastName);
    formData.append("status", data.status);
    formData.append("marks", data.graphData.marks);
    formData.append("average", data.graphData.average);
    formData.append("description", data.graphData.description);

    updateMutate(formData);
  };

  if (loadingUser || refetchingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="xl" color="blue" />
        <p className="ml-3 text-lg text-gray-600">Loading client data...</p>
      </div>
    );
  }

  if (!client || Object.keys(client).length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Client not found.</p>
      </div>
    );
  }

  if (!formReady) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="xl" color="blue" />
        <p className="ml-3 text-lg text-gray-600">Preparing form...</p>
      </div>
    );
  }
  return (
    <div className="mx-auto px-6 mt-10">
      <div className="mb-4">
        <h2 className="font-bold text-2xl text-secondary mb-2">
          Edit Client Record
        </h2>
        <p className="text-gray-600">
          Updating record for: {client.firstName} {client.lastName}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <form onSubmit={handleSubmit(onSubmitting)}>
          {/* Personal Information Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 border-b border-blue-300 mb-4 pb-2">
              <FaRegDotCircle className="text-secondary" />
              <h3 className="font-bold text-secondary text-lg">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter first name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="Enter middle name (optional)"
                  {...register("middleName")}
                />
              </div>

              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Certification Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 border-b border-blue-300 mb-4 pb-2">
              <FaRegDotCircle className="text-secondary" />
              <h3 className="font-bold text-secondary text-lg">
                Certification Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <FaCertificate className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    Certification eg PSW DE
                  </label>
                </div>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="Certification name"
                  {...register("certification", {
                    required: true,
                  })}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.certification?.type === "required" &&
                    "Required field"}
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <FaBook className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    Course Hours eg 700
                  </label>
                </div>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="Number of hours"
                  {...register("courseHours", {
                    required: true,
                  })}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.courseHours?.type === "required" && "Required field"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <FaBook className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    Modules separate by comma eg. PSW Foundations, Safety and
                    Mobility, Body Systems
                  </label>
                </div>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="Course modules"
                  {...register("modules", {
                    required: true,
                  })}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.modules?.type === "required" && "Required field"}
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <FaLink className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    Blockchain ID eg. 0x1234567890abcdef1234567890abcdef12345678
                    (random string)
                  </label>
                </div>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="Blockchain identifier"
                  {...register("blockChainId", {
                    required: true,
                  })}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.blockChainId?.type === "required" && "Required field"}
                </p>
              </div>
            </div>

            <div className="mb-4 mt-3">
              <div className="flex items-center space-x-1 mb-1">
                <MdDescription className="text-gray-500" />
                <label className="block text-md font-medium text-gray-700">
                  Course Description
                </label>
                <p>
                  eg. This certificate is issued for satisfactorily completing
                  the NACC final examination for the Personal Support Worker
                  (PSW) program which was comprised of the following modules:{" "}
                </p>
              </div>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                rows="2"
                placeholder="Enter course description"
                {...register("courseDescription", {
                  required: true,
                })}
              ></textarea>
              <p className="text-red-500 text-xs mt-1">
                {errors.courseDescription?.type === "required" &&
                  "Required field"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <FaCalendarAlt className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    Issued On
                  </label>
                </div>
                <input
                  type="date"
                  defaultValue={
                    client?.issuedOn
                      ? new Date(client.issuedOn).toISOString().split("T")[0]
                      : ""
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  {...register("issuedOn", {
                    required: true,
                  })}
                />

                <p className="text-red-500 text-xs mt-1">
                  {errors.issuedOn?.type === "required" && "Required field"}
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <FaCalendarAlt className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    Expires On
                  </label>
                </div>
                <input
                  type="date"
                  defaultValue={
                    client?.expiresOn === "Does not expire"
                      ? ""
                      : new Date(client.issuedOn).toISOString().split("T")[0]
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  {...register("expiresOn", {
                    required: false,
                  })}
                />
              </div>
            </div>
          </div>

          {/* Graph Data Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 border-b border-blue-300 mb-4 pb-2">
              <FaRegDotCircle className="text-secondary" />
              <h3 className="font-bold text-secondary text-lg">Graph Data</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Marks eg 70 (marks attained in the course)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="Enter marks"
                  {...register("graphData.marks", {
                    valueAsNumber: true,
                    required: true,
                  })}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors?.graphData?.marks?.type === "required" &&
                    "Required field"}
                </p>
              </div>
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Average eg 75 (average marks in the course)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="Enter average"
                  {...register("graphData.average", { required: true })}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.graphData?.average?.type === "required" &&
                    "Required field"}
                </p>
              </div>
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Description eg Top 27 percent of the course
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="Enter description"
                  {...register("graphData.description", { required: true })}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.graphData?.description?.type === "required" &&
                    "Required field"}
                </p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 border-b border-blue-300 mb-4 pb-2">
              <FaRegDotCircle className="text-secondary" />
              <h3 className="font-bold text-secondary text-lg">Status</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Client Status
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  {...register("status")}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-6 py-2 mx-2 bg-blue-600 disabled:bg-gray-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              disabled={loadingUpdate}
            >
              {loadingUpdate ? (
                <>
                  <Loader size={16} color="white" className="mr-2" />
                  Updating...
                </>
              ) : (
                "Update Client"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditClient;
