import React, { useState } from "react";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { RiHotelLine } from "react-icons/ri";
import { VscHistory } from "react-icons/vsc";
import { CgGym } from "react-icons/cg";
import { IoFastFoodOutline } from "react-icons/io5";
import { LuCircleDashed } from "react-icons/lu";
import { PiUserCircleCheckThin } from "react-icons/pi";
import { RiExchangeDollarLine } from "react-icons/ri";
import { TbMessageDollar } from "react-icons/tb";
import { IoBedOutline } from "react-icons/io5";
import { MdOutlineReviews } from "react-icons/md";
import { RiDiscountPercentLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import logo from "/logo.png";

const SideBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pages = [
    { link: "/branches", name: "Branch", icon: RiHotelLine },
    { link: "/rooms", name: "Room", icon: IoBedOutline },
    { link: "/roomsType", name: "Room Type", icon: MdOutlineBedroomParent },
    { link: "/amenities", name: "Amenity", icon: IoFastFoodOutline },
    { link: "/users", name: "User", icon: FaRegUser },
    { link: "/histories", name: "History", icon: VscHistory },
    {
      link: "/reservationStatus",
      name: "Reservation Status",
      icon: LuCircleDashed,
    },
    {
      link: "/subscriptions",
      name: "Subscription",
      icon: RiExchangeDollarLine,
    },
    {
      link: "/subscriptionsAdvantage",
      name: "Subscription Advantage",
      icon: TbMessageDollar,
    },
    { link: "/reviews", name: "Reviews", icon: MdOutlineReviews },
    { link: "/promotions", name: "promotion", icon: RiDiscountPercentLine },
  ];
  const location = useLocation();

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(!menuOpen);
        }}
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>

      <aside
        onClick={() => setMenuOpen(false)}
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 bg-[#52381D]`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4  overflow-y-auto bg-[#52381D] text-white ">
          <a href="#" className="flex items-center  ps-2.5 mb-5">
            <img src={logo} className=" mb-4 sm:h-11" alt="Apex" />
          </a>
          <ul className="space-y-2 font-medium">
            {pages.map((page) => {
              return (
                <li key={page.name}>
                  <Link
                    to={page.link}
                    className={`${
                      location.pathname === page.link ? "bg-[#81664B]" : ""
                    } flex items-center p-2 text-white rounded-lg   hover:bg-[#81664B]  group`}
                  >
                    {page.icon &&
                      React.createElement(page.icon, {
                        className: "w-6 h-6 ",
                      })}
                    <span className="ms-3">{page.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            to="/"
            className="bg-grey-100  font-bold py-2 text-main-800 w-3/4 rounded-3xl block text-center mt-7"
            onClick={() => localStorage.clear()}
          >
            Log out
          </Link>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
