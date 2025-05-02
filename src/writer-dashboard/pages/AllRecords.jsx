import React, { useEffect, useState } from "react";
import {
  Loader,
  Modal,
  Pagination,
  Select,
  Badge,
  Tooltip,
} from "@mantine/core";
import { useDebouncedState, useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCertificate,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { format } from "date-fns";

function AllRecords() {
  const [opened, { open, close }] = useDisclosure(false);
  const [perPage, setPerPage] = useState(10);
  const [activePage, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useDebouncedState("", 500);
  const [status, setStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  const getClients = () => {
    let url = `/client?page=${activePage}&perPage=${perPage}`;

    if (searchTerm) {
      url += `&searchTerm=${searchTerm}`;
    }

    if (status) {
      url += `&status=${status}`;
    }

    return axios.get(url);
  };

  const {
    isLoading: loadingClients,
    data: clientsData,
    refetch,
    isRefetching: refetchingClients,
  } = useQuery({
    queryKey: ["clients", activePage, perPage, searchTerm, status],
    queryFn: getClients,
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(clientsData?.data?.count / perPage);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    if (dateString === "Does not expire") return "Does not expire";

    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Get certification status
  const getCertificationStatus = (client) => {
    if (!client.certification) return "Not Certified";

    // Check if certificate is expired
    if (client.expiresOn && client.expiresOn !== "Does not expire") {
      const expiryDate = new Date(client.expiresOn);
      const today = new Date();

      if (expiryDate < today) {
        return "Expired";
      }
    }

    return "Certified";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Client Records</h1>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name or certification..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <MdOutlineFilterAlt className="mr-2" />
              Filters {showFilters ? "▲" : "▼"}
            </button>

            <Select
              placeholder="Records per page"
              value={perPage.toString()}
              onChange={(value) => setPerPage(parseInt(value))}
              data={[
                { value: "10", label: "10 per page" },
                { value: "20", label: "20 per page" },
                { value: "50", label: "50 per page" },
                { value: "100", label: "100 per page" },
              ]}
              className="w-full md:w-48"
            />
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Select
                    placeholder="Select status"
                    value={status}
                    onChange={setStatus}
                    data={[
                      { value: "", label: "All" },
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                      { value: "Pending", label: "Pending" },
                    ]}
                    clearable
                  />
                </div>

                {/* Add more filters as needed */}
              </div>
            </div>
          )}
        </div>

        {/* Client Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Client Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Certification
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Issue Date
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingClients || refetchingClients ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="flex justify-center">
                      <Loader color="blue" size={30} />
                    </div>
                    <p className="text-gray-500 mt-2">
                      Loading client records...
                    </p>
                  </td>
                </tr>
              ) : !clientsData?.data?.clients?.length ? (
                <tr>
                  <td colSpan={7} className="text-gray-800 text-center py-6">
                    <div className="flex flex-col items-center">
                      <FaSearch className="text-gray-400 text-3xl mb-2" />
                      <p>{clientsData?.data?.message}</p>
                      <p className="text-gray-500 text-md mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                clientsData?.data?.clients?.map((client, index) => {
                  const certStatus = getCertificationStatus(client);

                  return (
                    <tr
                      key={client._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                        {(activePage - 1) * perPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-700 font-medium text-md">
                              {client.firstName?.charAt(0)}
                              {client.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-md font-medium text-gray-900">
                              {client.firstName}{" "}
                              {client.middleName ? client.middleName + " " : ""}
                              {client.lastName}
                            </div>
                            <div className="text-md text-gray-500">
                              ID: {client._id.substring(client._id.length - 8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCertificate
                            className={`mr-2 ${
                              certStatus === "Certified"
                                ? "text-green-500"
                                : certStatus === "Expired"
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                          <div>
                            <div className="text-md font-medium text-gray-900">
                              {client.certification || "Not specified"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {client.courseHours
                                ? `${client.courseHours} hours`
                                : "Hours not specified"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md text-gray-500">
                        {formatDate(client.issuedOn)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          color={
                            client.status === "Active"
                              ? "green"
                              : client.status === "Inactive"
                              ? "red"
                              : "yellow"
                          }
                          variant="filled"
                          size="sm"
                        >
                          {client.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-md font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/dashboard/all-records/${client?.slug}`}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md transition-colors flex items-center"
                          >
                            <FaEye className="mr-1" /> View
                          </Link>
                          <Link
                            to={`/dashboard/all-records/edit/${client._id}`}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition-colors"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-md text-gray-500">
            Showing {clientsData?.data?.clients?.length || 0} of{" "}
            {clientsData?.data?.count || 0} results
          </div>
          <Pagination
            total={totalPages || 0}
            page={activePage}
            onChange={setPage}
            color="blue"
            radius="md"
          />
        </div>
      </div>
    </div>
  );
}

export default AllRecords;
