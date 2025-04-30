import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import F404Page from "./F404Page";
import Login from "./Login";
import DashboardWriter from "./writer-dashboard/DashboardWriter";
import ChangePasswordWriter from "./writer-dashboard/pages/ChangePasswordwriter";
import AddRecords from "./writer-dashboard/pages/AddRecords";
import AllRecords from "./writer-dashboard/pages/AllRecords";
import Profile from "./writer-dashboard/pages/Profile";
import ClientDetails from "./writer-dashboard/pages/ClientDetails";
import EditClient from "./writer-dashboard/pages/EditClient";

function App() {
  // Create a client
  const queryClient = new QueryClient();

  return (
    // routes
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<F404Page />} />

          {/* persist login */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
              <Route exact path="/dashboard" element={<DashboardWriter />}>
                <Route index element={<AllRecords />} />
                <Route path="add-records" element={<AddRecords />} />
                <Route path="all-records" element={<AllRecords />} />
                <Route path="all-records/:_id" element={<ClientDetails />} />
                <Route path="all-records/edit/:_id" element={<EditClient />} />
                <Route path="profile" element={<Profile />} />
                <Route
                  path="change-password"
                  element={<ChangePasswordWriter />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
