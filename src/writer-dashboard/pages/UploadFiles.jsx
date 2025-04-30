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

function UploadFiles({ client, closeModal }) {
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
    return axios.post("/client/upload/documents", data, {
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
      queryClient.invalidateQueries({ queryKey: [`client-${client?._id}`] });
      closeModal();
    },
    onError: (err) => {
      const text = err.response?.data?.message || "An error occurred";
      toast.error(text);
    },
  });

  const onSubmitting = async (data) => {
    const formData = new FormData();
    if (!certImageFile || !certPdfFile)
      return toast.error("Please upload both files.");

    // Add the lastUpdatedBy field
    formData.append("clientId", client?._id);
    // Append files if they exist
    if (certImageFile) {
      formData.append("certImage", certImageFile);
    }

    if (certPdfFile) {
      formData.append("certPdf", certPdfFile);
    }

    formData.append("lastName", data.lastName);

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
    <div className="">
      <div className="">
        <form onSubmit={handleSubmit(onSubmitting)}>
          {/* Personal Information Section */}

          {/* Documents Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 border-b border-blue-300 mb-4 pb-2">
              <FaRegDotCircle className="text-secondary" />
              <h3 className="font-bold text-secondary text-lg">
                Upload Documents
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            {loadingAdd ? (
              <div>
                <p>Please wait...</p>
              </div>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 mx-2 bg-blue-600 disabled:bg-gray-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                disabled={loadingAdd}
              >
                Upload files
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadFiles;
