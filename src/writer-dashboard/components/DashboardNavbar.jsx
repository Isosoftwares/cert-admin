import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
} from "@material-tailwind/react";
import { Cog6ToothIcon, Bars3Icon } from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "../../context/sidenav-context";
import UserMenu from "../UserMenu";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  const { auth } = useAuth();
  const axios = useAxiosPrivate();

  function getCurrentFormattedDate() {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const currentDate = new Date();
    const dayOfWeek = days[currentDate.getDay()];
    const dayOfMonth = currentDate.getDate();
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");

    const formattedDate = `${dayOfWeek} ${dayOfMonth}, ${hours}:${minutes}`;

    return formattedDate;
  }

  // Example usage
  const [currentFormattedDate, setCurrentFormattedDate] = useState(
    getCurrentFormattedDate()
  );
  useEffect(() => {
    // Update the current date every second
    const intervalId = setInterval(() => {
      setCurrentFormattedDate(getCurrentFormattedDate());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-md bg-light transition-all ${
        fixedNavbar
          ? "sticky top-0 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : " py-3 px-3 "
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex  justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize hidden xl:inline">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}/overview`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Link to={"/dashboard/profile"}>
            <div className="text-gray-800 gap-1 flex mt-2 items-center ">
              <p className="text-xs  ">Welcome,</p>
              <p className="text-sm font-semibold  ">{auth?.name}</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
        </div>
        <div className="">
          <div className="flex justify-center items-center gap-2 text-gray-800">
            <div>
              <h1 className="text-xs ">
                {currentFormattedDate?.split(",")[0]}
              </h1>
              <h1 className="text-xs font-bold text-right">
                {currentFormattedDate?.split(",")[1]}
              </h1>
            </div>

            {/*  Divider */}
            <hr className="w-px h-6 hidden lg:inline bg-blue-200 mx-3" />

            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => setOpenConfigurator(dispatch, true)}
            >
              <Cog6ToothIcon className="h-7 w-7 text-blue-gray-500" />
            </IconButton>

            <UserMenu />
          </div>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
