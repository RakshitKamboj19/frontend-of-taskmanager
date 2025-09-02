import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../redux/actions/authActions";

const Navbar = ({ Dark, setDark }) => {
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("dark-mode");
    if (savedTheme) setDark(JSON.parse(savedTheme));
  }, [setDark]);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  const toggleTheme = () => {
    const newTheme = !Dark;
    setDark(newTheme);
    localStorage.setItem("dark-mode", JSON.stringify(newTheme));
  };

  const renderNavLinks = () => (
    <>
      {authState.isLoggedIn ? (
        <>
          <li
            className={`py-2 px-3 rounded-md ${
              location.pathname === "/tasks/add" ? "bg-blue-500 text-white" : ""
            }`}
          >
            <Link to="/tasks/add" className="block w-full h-full">
              <i className="fa-solid fa-plus"></i> Add Task
            </Link>
          </li>
          <li
            className="py-2 px-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition rounded-md"
            onClick={handleLogoutClick}
          >
            Logout
          </li>
        </>
      ) : (
        <li
          className={`py-2 px-3 cursor-pointer transition rounded-md ${
            location.pathname === "/login"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <Link to="/login">Login</Link>
        </li>
      )}
      <li
        className="py-2 px-3 cursor-pointer dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-md transition"
        onClick={toggleTheme}
      >
        <i
          className={`mr-2 ${Dark ? "fa-solid fa-sun" : "fa-solid fa-moon"}`}
        ></i>
      </li>
    </>
  );

  return (
    <header
      className={`sticky top-0 ${
        Dark ? "bg-gray-800 text-white" : "bg-white/80 backdrop-blur text-black"
      } shadow-elev-1 transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <h1 className="cursor-pointer flex items-center">
          <Link to="/" className="flex items-center">
          <i className="fas fa-tasks text-2xl mr-2 text-blue-500"></i>
            <span className="text-2xl font-extrabold tracking-tight text-brand dark:text-blue-400">Task Manager</span>
          </Link>
        </h1>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-3 font-medium">
          {authState.isLoggedIn ? (
            <li>
              <Link to="/tasks/add" className="btn-primary px-4 py-2">+ Add Task</Link>
            </li>
          ) : (
            <li>
              <Link to="/login" className="btn-primary px-4 py-2">Login</Link>
            </li>
          )}
          <li>
            <button onClick={handleLogoutClick} className={`hidden ${authState.isLoggedIn ? 'md:inline-block' : 'md:hidden'} px-4 py-2 rounded-xl ${Dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}>
              Logout
            </button>
          </li>
          <li>
            <button onClick={toggleTheme} className={`w-10 h-10 rounded-full flex items-center justify-center ${Dark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`} aria-label="Toggle Theme">
              <i className={`${Dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}`}></i>
            </button>
          </li>
        </ul>

        {/* Hamburger Icon for Mobile */}
        <span
          className="md:hidden cursor-pointer text-gray-700 dark:text-gray-300"
          onClick={toggleNavbar}
          aria-label="Toggle Navigation Menu"
        >
          <i className="fa-solid fa-bars"></i>
        </span>
      </div>

      {/* Mobile Navigation */}
      {isNavbarOpen && (
        <div
          className={`fixed inset-0 ${
            Dark ? "bg-gray-900" : "bg-gray-100"
          } shadow-md w-screen sm:w-9/12 h-screen transition-transform transform translate-x-0 md:translate-x-full z-50`}
          aria-label="Mobile Navigation Menu"
        >
          <div className="flex">
            <span
              className="m-4 ml-auto cursor-pointer text-gray-700 dark:text-gray-300"
              onClick={toggleNavbar}
              aria-label="Close Navigation Menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </span>
          </div>
          <ul className="flex flex-col gap-4 uppercase font-medium text-center">
            {renderNavLinks()}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
