import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import TodayWidget from '../components/TodayWidget';
import MainLayout from '../layouts/MainLayout';

const Home = ({ Dark, setDark }) => {
  const authState = useSelector((state) => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = authState.isLoggedIn
      ? `${authState.user.name}'s Tasks`
      : 'Task Manager';
  }, [authState]);

  // Define dynamic classes for dark mode
  const backgroundClass = Dark ? 'bg-gray-900' : 'bg-gray-100';
  const textClass = Dark ? 'text-gray-300' : 'text-gray-800';
  const headingClass = Dark ? 'text-gray-100' : 'text-brand';
  const cardClass = Dark ? 'bg-gray-800' : 'bg-white';
  const gradientClass = Dark
    ? 'bg-gradient-to-r from-gray-700 to-gray-800'
    : 'bg-gradient-to-r from-blue-500 to-indigo-600';
  const buttonPrimaryClass = Dark
    ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
    : 'bg-white text-brand hover:bg-gray-100';
  const buttonSecondaryClass = Dark
    ? 'border-gray-500 text-gray-300 hover:bg-gray-700 hover:border-gray-400'
    : 'border-white text-white hover:bg-white hover:text-blue-600';

  return (
    <MainLayout Dark={Dark} setDark={setDark}>
      {/* Animated Welcome Section */}
      {!isLoggedIn ? (
        <motion.div
          className={`${gradientClass} text-white h-auto py-12 text-center relative overflow-hidden`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 -z-10" style={{ backgroundImage: 'var(--bg-gradient)' }} />
          <div className="max-w-3xl mx-auto ">
            <h1 className="text-4xl font-extrabold mb-3">Welcome to Task Manager</h1>
            <p className="text-lg opacity-90">
              Organize your life and boost productivity with a simple, elegant task management system.
            </p>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <motion.div whileTap={{ scale: 0.98 }} whileHover={{ y: -2 }}>
              <Link
                to="/signup"
                className={`btn-primary text-xl`}
              >
                Join Now
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }} whileHover={{ y: -2 }}>
              <Link
                to="/login"
                className={`btn-ghost text-xl`}
              >
                Login
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className={`${backgroundClass} min-h-screen`}>
          <motion.h1
            className={`text-3xl font-bold mt-8 mx-8 border-b pb-2 ${headingClass}`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Welcome, {authState.user.name}!
          </motion.h1>
          <motion.div
            className={`mx-8 my-6 p-4 rounded-2xl card ${cardClass}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-6">
              <TodayWidget />
            </div>
            <Tasks Dark={Dark} setDark={setDark} />
          </motion.div>

          {/* Floating Add Task Button */}
          <div className="fixed right-6 bottom-8 md:bottom-12">
            <Link to="/tasks/add" className="btn-primary rounded-full w-14 h-14 flex items-center justify-center text-2xl shadow-elev-2">
              +
            </Link>
          </div>
        </div>
      )}

      {/* Animated Features Section */}
      {!isLoggedIn && (
        <motion.div
          className={`${backgroundClass} py-12`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-6 ${textClass}`}>
              Why Choose Task Manager?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className={`p-4 rounded-md shadow-md ${cardClass}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <i
                  className="fa-solid fa-check-circle text-blue-600 text-4xl mb-4"
                  aria-hidden="true"
                ></i>
                <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>
                  Easy to Use
                </h3>
                <p className={`${textClass}`}>
                  Add, organize, and complete tasks effortlessly with our user-friendly interface.
                </p>
              </motion.div>

              <motion.div
                className={`p-4 rounded-md shadow-md ${cardClass}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <i
                  className="fa-solid fa-clock text-green-600 text-4xl mb-4"
                  aria-hidden="true"
                ></i>
                <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>
                  Save Time
                </h3>
                <p className={`${textClass}`}>
                  Spend less time managing tasks and more time achieving your goals.
                </p>
              </motion.div>

              <motion.div
                className={`p-4 rounded-md shadow-md ${cardClass}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <i
                  className="fa-solid fa-mobile-screen text-purple-600 text-4xl mb-4"
                  aria-hidden="true"
                ></i>
                <h3 className={`text-xl font-semibold mb-2 ${textClass}`}>
                  Mobile Friendly
                </h3>
                <p className={`${textClass}`}>
                  Access your tasks anytime, anywhere from any device.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Home;