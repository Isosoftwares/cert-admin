import { Routes, Route, Outlet } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import Sidenav from "./components/sidenav";
import Configurator from "./components/Configurator";
import DashboardNavbar from "./components/DashboardNavbar";
import Footer from "./components/Footer";
import routes from "./components/routes";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav
} from "../context/sidenav-context";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  // const { sidenavType, openConfigurator } = controller;
  const { openConfigurator, sidenavColor, sidenavType, fixedNavbar } =
    controller;

    const allRoutes = routes()


  return (
    <div className="min-h-screen bg-blue-gray-50/50"  >
      <Sidenav
        routes={allRoutes}
        brandImg={
          sidenavType === "dark"
            ? "../assets/graphics/official-logo-2.png"
            : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />

        <main className="min-h-[80vh] " 
          onClick={() => {
            if (openConfigurator) {
              setOpenConfigurator(dispatch, false);
            }
            setOpenSidenav(dispatch, false)
            return 0;

          }}
         >
          <Outlet></Outlet>
        </main>

        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
