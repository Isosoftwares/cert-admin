import {
  HomeIcon,
  UserCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import {
  MdAddTask,
  MdVerifiedUser,
  MdMoveToInbox,
  MdCalculate,
  MdTextsms,
} from "react-icons/md";
import { FaRoute } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

// Function to create routes dynamically
export const createRoutes = (dashboardData) => [
  {
    title: "Records",
    layout: "dashboard",
    pages: [
      {
        icon: <MdMoveToInbox {...icon} />,
        name: "All Records",
        path: "/all-records",
      },
      {
        icon: <MdMoveToInbox {...icon} />,
        name: "Add Record",
        path: "/add-records",
      },
      {
        icon: <MdMoveToInbox {...icon} />,
        name: "Profile",
        path: "/profile",
      },
    ],
  },
  // {
  //   title: "Account",
  //   layout: "writer",
  //   pages: [
  //     {
  //       icon: <MdCalculate {...icon} />,
  //       name: "My Earnings",
  //       path: "/my-earning",
  //     },
  //     {
  //       icon: <MdCalculate {...icon} />,
  //       name: "Profile",
  //       path: "/profile",
  //     },
  //   ],
  // },
];

//Export only the routes
export const routes = () => {
  return createRoutes();
};

export default routes;
