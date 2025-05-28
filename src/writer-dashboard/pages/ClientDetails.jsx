import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Loader, Badge } from "@mantine/core";
import {
  FaLink,
  FaCertificate,
  FaClock,
  FaBook,
  FaTrophy,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { format } from "date-fns";
import getDomain from "../../utils/ClientDomain";
import { BsFilePdf } from "react-icons/bs";
import UploadFiles from "./UploadFiles";

function ClientDetails() {
  const { _id } = useParams();
  const axios = useAxiosPrivate();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [
    openedUpload,
    { open: openUpload, close: closeUpload },
  ] = useDisclosure(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

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
    retry: 1,
    enabled: !!_id,
  });

  const { client = {} } = userData?.data || {};

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/client/delete/permanent/${auth.userId}/${client?._id}`);
    },
    onSuccess: () => {
      toast.success("Client deleted successfully");
      queryClient.invalidateQueries([`client-${_id}`]);
      close();
      navigate("/dashboard/all-records");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete client");
      setDeleteLoading(false);
    },
  });

  const handleDelete = () => {
    setDeleteLoading(true);
    deleteMutation.mutate();
  };

  const downloadFile = async (url, filename) => {
    try {
      // Show loading toast while preparing the download
      const toastId = toast.loading("Preparing download...");

      // Fetch the file from URL
      const response = await fetch(url);

      // Convert to blob and create a downloadable object URL
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      // Create and trigger download via a temporary link element
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up and show success message
      window.URL.revokeObjectURL(objectUrl);
      toast.update(toastId, {
        render: "Download started",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      // Handle errors
      console.error("Download error:", error);
      toast.error(`Failed to download: ${error.message}`);
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    if (dateString === "Does not expire") return "Does not expire";

    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Check if a URL is valid
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader color="blue" size="lg" />
        <p className="mt-4 text-gray-600">Loading client details...</p>
      </div>
    );
  }

  if (!client || Object.keys(client).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">Client not found</p>
        <Link
          to="/dashboard/all-records"
          className="text-blue-500 hover:underline mt-2 inline-block"
        >
          Return to clients list
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 min-h-screen">
      {/* Delete Confirmation Modal */}
      <Modal opened={opened} onClose={close} title="Delete Client">
        <div className="p-2">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this client? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              color="gray"
              onClick={close}
              disabled={deleteLoading}
              size="lg"
            >
              Cancel
            </Button>

            <button
              className="bg-red-600 text-light px-4 py-2 rounded-md"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        opened={openedUpload}
        onClose={closeUpload}
        title="Upload documents"
      >
        <UploadFiles client={client} closeModal={closeUpload} />
      </Modal>

      {/* Header with navigation and actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">Client Details</h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/dashboard/all-records/edit/${_id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FaEdit className="mr-2" /> Edit
          </Link>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            onClick={open}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-700 font-bold text-xl">
                {client.firstName?.charAt(0)}
                {client.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold capitalize">
                {client.firstName} {client.middleName} {client.lastName}
              </h2>
              <Badge
                color={
                  client.status === "Active"
                    ? "green"
                    : client.status === "Inactive"
                    ? "red"
                    : "yellow"
                }
                size="lg"
                className="mt-1"
              >
                {client.status}
              </Badge>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <FaLink className="text-gray-500 mt-1 mr-3" />
              <div>
                <p className="text-md text-gray-500">Client Link </p>
                <p className="text-gray-800 break-all">{`${getDomain()}/${
                  client?.slug
                }`}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certification Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <div className="flex items-center mb-4">
            <FaCertificate className="text-blue-600 mr-2 text-xl" />
            <h2 className="text-xl font-bold">Certification Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-md text-gray-500">Certification Type</p>
              <p className="text-gray-800 font-medium">
                {client.certification || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-md text-gray-500">Course Hours</p>
              <p className="text-gray-800 font-medium">
                {client.courseHours
                  ? `${client.courseHours} hours`
                  : "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-md text-gray-500">Issued On</p>
              <p className="text-gray-800 font-medium">
                {formatDate(client.issuedOn)}
              </p>
            </div>

            <div>
              <p className="text-md text-gray-500">Expires On</p>
              <p className="text-gray-800 font-medium">Does not expire</p>
            </div>

            <div>
              <p className="text-md text-gray-500">Blockchain ID</p>
              <p className="text-gray-800 font-medium">
                {client.blockChainId || "Not specified"}
              </p>
            </div>
          </div>

          {client.modules && (
            <div className="mt-6">
              <p className="text-md text-gray-500 mb-1">Modules</p>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-gray-800">{client.modules}</p>
              </div>
            </div>
          )}

          {client.courseDescription && (
            <div className="mt-6">
              <p className="text-md text-gray-500 mb-1">Course Description</p>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-gray-800">{client.courseDescription}</p>
              </div>
            </div>
          )}
        </div>

        {/* Certificate Documents Card */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center mb-4">
              <FaBook className="text-blue-600 mr-2 text-xl" />
              <h2 className="text-xl font-bold">Certificate Documents</h2>
            </div>
            <button
              onClick={openUpload}
              className="bg-primary text-light px-2 py-2 rounded-md  "
            >
              Upload/Re-upload
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {client?.clientDocs?.certImage &&
              isValidUrl(client?.clientDocs?.certImage) && (
                <div>
                  <p className="text-md text-gray-500 mb-2">
                    Certificate Image
                  </p>
                  <div className="border border-gray-200 rounded-md p-6 flex flex-col items-center justify-center h-48">
                    <div className="text-center mb-4">
                      <img
                        src="/path/to/image-icon.png"
                        alt="Certificate"
                        className="w-16 h-16 mx-auto mb-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "";
                          e.target.className = "hidden";
                        }}
                      />
                      <p className="text-gray-700 font-medium">
                        Certificate Image
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        downloadFile(
                          client.clientDocs.certImage,
                          `certificate_${client._id}.jpg`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Download Image
                    </button>
                  </div>
                </div>
              )}

            {client?.clientDocs?.certPdf &&
              isValidUrl(client?.clientDocs?.certPdf) && (
                <div>
                  <p className="text-md text-gray-500 mb-2">Certificate PDF</p>
                  <div className="border border-gray-200 rounded-md p-6 flex flex-col items-center justify-center h-48">
                    <div className="text-center mb-4">
                      <BsFilePdf className="w-16 h-16 mx-auto text-red-500 mb-2" />
                      <p className="text-gray-700 font-medium">
                        Certificate PDF
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        downloadFile(
                          client.clientDocs.certPdf,
                          `certificate_${client._id}.pdf`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
          </div>

          {!client?.clientDocs?.certImage && !client?.clientDocs?.certPdf && (
            <p className="text-gray-500 italic">
              No certificate documents uploaded
            </p>
          )}
        </div>

        {/* Graph Data Card */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
          <div className="flex items-center mb-4">
            <FaTrophy className="text-blue-600 mr-2 text-xl" />
            <h2 className="text-xl font-bold">Performance Data</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {client?.graphData?.marks && (
              <div className="p-4 bg-blue-50 rounded-md text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {client?.graphData?.marks}
                </p>
                <p className="text-md text-gray-600">Marks</p>
              </div>
            )}

            {client?.graphData?.average && (
              <div className="p-4 bg-green-50 rounded-md text-center">
                <p className="text-2xl font-bold text-green-700">
                  {client?.graphData?.average}
                </p>
                <p className="text-md text-gray-600">Average</p>
              </div>
            )}

            {client?.graphData?.description && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-md text-gray-500 mb-1">Description</p>
                <p className="text-gray-800">
                  {client?.graphData?.description}
                </p>
              </div>
            )}
          </div>

          {!client.graphData?.marks &&
            !client.graphData?.average &&
            !client.graphData?.description && (
              <p className="text-gray-500 italic">
                No performance data available
              </p>
            )}
        </div>

        {/* System Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
          <div className="flex items-center mb-4">
            <FaClock className="text-blue-600 mr-2 text-xl" />
            <h2 className="text-xl font-bold">System Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-md">
            <div>
              <p className="text-gray-500">Client slug</p>
              <p className="text-gray-800 font-mono break-all">
                {client?.slug}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Created At</p>
              <p className="text-gray-800">{formatDate(client?.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="text-gray-800">{formatDate(client?.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientDetails;
