import React from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

function Profile() {
  const axios = useAxiosPrivate();
  const { auth } = useAuth();

  // Get user profile
  const getProfile = () => {
    return axios.get(`/user/one/${auth?.userId}`);
  };

  const {
    isLoading: loadingUser,
    error: profileError,
    data: userData,
    refetch,
  } = useQuery({
    queryFn: getProfile,
    queryKey: [`user-${auth?.userId}`, auth?.userId],
    keepPreviousData: true,
  });

  const user = userData?.data?.user;

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading profile</h3>
        <p className="text-red-600">Please try again later</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 overflow-hidden bg-white rounded-lg shadow mt-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b pb-4">
        <div className="flex items-center">
          <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
            {user?.userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.userName || "User"}
            </h1>
            <p className="text-gray-600">
              {user?.email || "No email available"}
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user?.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user?.status || "Unknown"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">User ID</h3>
            <p className="mt-1 text-sm text-gray-900 break-all">
              {user?._id || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Roles</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {user?.roles && user.roles.length > 0 ? (
                user.roles.map((role, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {role}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-700">No roles assigned</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Permissions</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {user?.permissions && user.permissions.length > 0 ? (
                user.permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                  >
                    {permission}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-700">
                  No specific permissions
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Email Verification
            </h3>
            <p className="mt-1 text-sm">
              {user?.isEmailVerified ? (
                <span className="text-green-600 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Not Verified
                </span>
              )}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Account Created
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(user?.createdAt)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(user?.updatedAt)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(user?.lastLogin)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t">
        <h3 className="text-sm font-medium text-gray-500">Active Sessions</h3>
        {user?.activeSessions && user.activeSessions.length > 0 ? (
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {user.activeSessions.map((session, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {session.device || "Unknown"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {session.ip || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {formatDate(session.lastActivity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-700">No active sessions</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
