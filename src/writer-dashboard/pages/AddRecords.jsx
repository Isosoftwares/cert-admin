import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

function AddRecords({ isModal, closeModal }) {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const [certImageFile, setCertImageFile] = useState(null);
  const [certPdfFile, setCertPdfFile] = useState(null);

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

  const addFnc = (data) => {
    return axios.post("/client", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const { mutate: addMutate, isLoading: loadingAdd } = useMutation({
    mutationFn: addFnc,
    onSuccess: (response) => {
      reset();
      setCertImageFile(null);
      setCertPdfFile(null);
      const text = response?.data?.message;
      toast.success(text);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
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
    // Append files if they exist
    if (certImageFile) {
      formData.append("certImage", certImageFile);
    }

    if (certPdfFile) {
      formData.append("certPdf", certPdfFile);
    }
    formData.append("certification", data.certification);
    formData.append("courseHours", data.courseHours);
    formData.append("modules", data.modules);
    formData.append("blockChainId", data.blockChainId);
    formData.append("courseDescription", data.courseDescription);
    formData.append("issuedOn", data.issuedOn.toISOString());
    // formData.append("expiresOn", data.expiresOn?.toISOString() || "");
    formData.append("firstName", data.firstName);
    formData.append("middleName", data.middleName);
    formData.append("lastName", data.lastName);
    formData.append("slug", data.slug.trim());
    formData.append("marks", data.graphData.marks);
    formData.append("average", data.graphData.average);
    formData.append("description", data.graphData.description);

    addMutate(formData);
  };

  // Handle file changes
  const handleCertImageChange = (e) => {
    if (e.target.files[0]) {
      setCertImageFile(e.target.files[0]);
    }
  };

  const handleCertPdfChange = (e) => {
    if (e.target.files[0]) {
      setCertPdfFile(e.target.files[0]);
    }
  };

  return (
    <div className=" mx-auto px-6 mt-10">
      <div className="mb-4">
        <h2 className="font-bold text-2xl text-secondary mb-2">Add Record</h2>
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
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <FaLink className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    slug ( the string to indentify the cert) eg.
                    7d751cd1-b419-4928-b4e3-103e0ba4af24#acc.CPL0HzlV (random
                    string)
                  </label>
                </div>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="slug"
                  {...register("slug", {
                    required: true,
                  })}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.slug?.type === "required" && "Required field"}
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
                <Controller
                  name="issuedOn"
                  control={control}
                  required={true}
                  render={({ field }) => (
                    <DateInput
                      placeholder="Select date"
                      size="md"
                      className="w-full"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
                <p className="text-red-500 text-xs mt-1">
                  {errors.issuedOn?.type === "required" && "Required field"}
                </p>
              </div>

              {/* <div>
                <div className="flex items-center space-x-1 mb-1">
                  <FaCalendarAlt className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    Expires On
                  </label>
                </div>
                <Controller
                  name="expiresOn"
                  control={control}
                  render={({ field }) => (
                    <DateInput
                      size="md"
                      placeholder="Select date"
                      className="w-full"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
              </div> */}
            </div>
          </div>

          {/* Documents Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 border-b border-blue-300 mb-4 pb-2">
              <FaRegDotCircle className="text-secondary" />
              <h3 className="font-bold text-secondary text-lg">
                Upload Documents
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <BsFileImage className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    Certificate Image
                  </label>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition cursor-pointer">
                  <input
                    type="file"
                    id="certImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleCertImageChange}
                  />
                  <label htmlFor="certImage" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-2">
                      <FaUpload className="text-gray-400 text-xl mb-1" />
                      <p className="text-md text-gray-600">
                        Click to upload certificate image
                      </p>
                    </div>
                  </label>
                  {certImageFile && (
                    <div className="mt-1 text-md text-green-600 flex items-center justify-center">
                      <BsFileImage className="mr-1" />
                      {certImageFile.name}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-1 mb-2">
                  <BsFilePdf className="text-gray-500" />
                  <label className="block text-md font-medium text-gray-700">
                    Certificate PDF
                  </label>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:bg-gray-50 transition cursor-pointer">
                  <input
                    type="file"
                    id="certPdf"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleCertPdfChange}
                  />
                  <label htmlFor="certPdf" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-2">
                      <FaUpload className="text-gray-400 text-xl mb-1" />
                      <p className="text-md text-gray-600">
                        Click to upload certificate PDF
                      </p>
                    </div>
                  </label>
                  {certPdfFile && (
                    <div className="mt-1 text-md text-green-600 flex items-center justify-center">
                      <BsFilePdf className="mr-1" />
                      {certPdfFile.name}
                    </div>
                  )}
                </div>
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

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-6 py-2 mx-2 bg-blue-600 disabled:bg-gray-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
              disabled={loadingAdd}
            >
              {loadingAdd ? (
                <>
                  <Loader size={16} color="white" className="mr-2" />
                  Registering...
                </>
              ) : (
                "Register Client"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRecords;
