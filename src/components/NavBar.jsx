import React, { useState, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import ServicesMenu from "../website/components/ServicesMenu";
import Logo from "../assets/graphics/official-logo-2.png";

function NavBar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 70 && !scrolled) {
        setScrolled(true);
      } else if (window.pageYOffset <= 70 && scrolled) {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const navItems = [
    {
      name: "Home", path: "/"
    },
    {
      name: 'Services', path: '/our-services'
    },
    {
      name: "Our Pricing", path: "/pricing"
    },
    {
      name: "About Us", path: "/about-us"
    },
    {
      name: "Blog", path: "/blog"
    },

  ];

  return (

    <div className={`fixed top-0 left-0 right-0 z-50 `}>
      <div className={`   ${scrolled && 'hidden'}   bg-primary min-h-5  px-4 md:px-[100px] flex flex-row justify-between ease-in-out duration-500 `}>
        <h1 className="text-light text-[12px]">Content is King!</h1>
        <div className="flex gap-6">
          <h1 className="text-light text-[12px]">   +1 555 87 89 56
          </h1>
          <h1 className="hidden md:inline text-light text-[12px]">
            80 Harrison Lane, FL 32547

          </h1>
        </div>
      </div>
      <div className={`flex justify-between md:justify-between md:gap-[90px]  items-center px-1   md:px-[100px] py-5 bg-light ${scrolled && 'shadow-md'} `}>
        <Link to='/'>
          <div className=" text-xl flex  justify-center items-center gap-1 text-dark">

            <div>
              <img src={Logo} className="h-[30px] " alt="Logo" />
            </div>
          </div>


        </Link>
        <div className="mr-[] flex items-center gap-2 ">
          <ul className="hidden lg:flex gap-3  font-semibold text-opacity-100 ">
            {navItems?.map((item, index) => {
              return (
                <NavLink to={item.path} key={index}>
                  <li
                    key={index}
                    className="  px-3 py-2 text-secondary custom-hover hover:text-primary  rounded-sm "
                  >
                    {item.name}
                  </li>
                </NavLink>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden xl:inline">
            <Link to={"/login"} className="bg-primary break-words text-light px-5 py-3 rounded-md ">Order Now</Link>
          </div>
        </div>

        <div className="lg:hidden pr-3">
          {mobileMenu ? (
            <div
              onClick={(e) => {
                setMobileMenu(!mobileMenu);
              }}
            >
              <MdClose size={30} color="#000" />
            </div>
          ) : (
            <div
              onClick={(e) => {
                setMobileMenu(!mobileMenu);
              }}
            >
              <MdMenu size={30} color="#000" />
            </div>
          )}
        </div>
      </div>
      {/* mobile menu */}
      <div
        className={
          mobileMenu
            ? "absolute top-[px] ease-in-out duration-500 h-screen flex flex-col bg-light w-[100%] py-6 lg:hidden"
            : " absolute left-[-100%] "
        }
      >
        <ul className="flex flex-col  gap-2  font-semibold text-opacity-100  ">
          {navItems?.map((item, index) => {
            if (item?.name === "Services") {
              return (
                <Link>

                  <ServicesMenu />
                </Link>

              )
            }

            return (
              <NavLink key={index} to={item.path}>
                <li className=" px-4 py-2 hover:text-primary custom-hover border-b-primary text-start cursor-pointer">
                  {item.name}
                </li>
              </NavLink>
            );
          })}
        </ul>

        <div className="flex px-5 my-6 items-center gap-3">
          <div className="">
            <Link to={"/login"} className="bg-primary break-words text-light px-5 py-3 rounded-md ">Order Now</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default NavBar;
