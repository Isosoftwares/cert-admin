import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Transition from "../utils/Transition";
import { FaWallet, FaUserCircle } from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import UserAvatar from "../assets/graphics/avatar.png";

function UserMenu() {
  const { auth } = useAuth();
  const logOut = useLogout();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const signOut = async () => {
    await logOut();
    navigate("/");
  };
  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          className="w-7 h-7 rounded-full"
          src={auth?.imgUrl || UserAvatar}
          width="32"
          height="32"
          alt="User"
        />
        <div className="flex items-center truncate">
          <svg
            className="w-3 h-3 shrink-0 ml-1 fill-current text-blue-400"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-blue-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className="flex flex-col gap-2 min-w-[200px]"
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-blue-200">
            <div className="font-medium text-gray-800">{auth?.name} </div>
            <div className="text-sm text-gray-500 italic">{auth?.roles[0]}</div>
          </div>

          <div className="border-b text-gray-800">
            <Link
              to={"/dashboard/change-password"}
              className="flex justify-start items-center gap-2 px-3 hover:bg-gray-200 py-2 hover:text-gray-800"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle size={20} />
              <h1>Change Password </h1>
            </Link>
          </div>
          <div
            className="cursor-pointer text-gray-800 hover:bg-gray-200 "
            onClick={() => {
              signOut();
            }}
          >
            <h1 className="flex justify-start items-center gap-2 px-3  py-1 ">
              <CgLogOut size={22} className="md:mt-1" />
              <h1>Logout </h1>
            </h1>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default UserMenu;
