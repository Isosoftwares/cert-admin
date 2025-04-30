import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "../../context/sidenav-context";
import Logo from "../../assets/graphics/logo.jpg";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-blue-gray-800 to-blue-gray-900",
    white: "bg-light shadow-lg",
    transparent: "bg-transparent shadow-lg",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50  h-[calc(100vh)] w-80  overflow-y-auto no-scrollbar transition-transform duration-300 xl:translate-x-0`}
    >
      <div
        className={`relative border-b ${
          sidenavType === "dark" ? "border-white/20" : "border-blue-gray-50"
        }`}
      >
        <Link
          to="/dashboard/overview"
          className="flex items-center gap-4 py-6 px-8"
        >
          {/* <img src={Logo} alt="logo" className="h-[100px] w-full"  /> */}
          <h1
            className={`${
              sidenavType === "dark" ? "text-light " : "text-dark "
            } text-3xl font-bold `}
          >
            Manage
            <span className="tracking-wider py-2 text-3xl font-bold text-primary ">
              Service
            </span>{" "}
          </h1>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-2 top-4 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon
            strokeWidth={3}
            className={`h-5 w-5 ${
              sidenavType === "dark" ? "text-light" : "text-dark"
            }`}
          />
        </IconButton>
      </div>

      <div className="m-4 h-[400px] ">
        {routes.map(({ layout, title, pages }, key) => (
          <ul key={key} className="mb-4 flex flex-col  gap-1">
            {title && (
              <li className="mx-3.5 mt-1 mb-">
                <Typography
                  variant="small"
                  color={sidenavType === "dark" ? "white" : "blue-gray"}
                  className="font-black capitalize opacity-90 "
                >
                  {title}
                </Typography>
              </li>
            )}
            {pages.map(({ icon, name, path, count = 0, color = "green" }) => (
              <li key={name}>
                <NavLink
                  to={`/${layout}${path}`}
                  onClick={() => setOpenSidenav(dispatch, false)}
                >
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? sidenavColor
                          : sidenavType === "dark"
                          ? "white"
                          : "blue-gray"
                      }
                      className="flex items-center justify-between px-4 rounded-sm capitalize"
                      fullWidth
                    >
                      <div className="flex items-center gap-3">
                        {icon}
                        <Typography
                          color="inherit"
                          className="font-medium capitalize"
                        >
                          {name}
                        </Typography>
                      </div>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: { Logo },
  brandName: "Noyfeed",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
