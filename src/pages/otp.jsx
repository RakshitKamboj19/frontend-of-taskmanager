import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { saveProfile } from "../redux/actions/authActions";

import { motion } from "framer-motion";
import FancyInput from "../components/utils/FancyInput";
import Loader from "../components/utils/Loader";

const OtpPage = ({ Dark, setDark }) => {
  const [fetchData, { loading }] = useFetch();
  const [formData, setFormData] = useState({
    email: localStorage.getItem("email"),
    otp: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleResend = async () => {
    try {
      const config = { url: "/auth/otp/resend", method: "post", data: { email: formData.email } };
      await fetchData(config, { showSuccessToast: true });
    } catch (err) {
      console.error("Error resending OTP:", err?.message || err);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = { url: "/auth/otp", method: "post", data: formData };
      const data = await fetchData(config);
      // Clean up stored email
      localStorage.removeItem("email");
      // If backend returns token/user on success, persist and hydrate auth state
      if (data?.token) {
        localStorage.setItem("token", data.token);
        try { dispatch(saveProfile(data.token)); } catch {}
      }
      navigate("/");
    } catch (err) {
      console.error("Error verifying OTP:", err.message);
      setError("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <form
      className={`m-auto my-16 max-w-[500px] p-8 rounded-2xl card ${Dark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
    >
      {loading ? (
        <Loader />
      ) : (
        <motion.div
          className={`min-h-screen flex items-center justify-center ${Dark ? 'bg-gray-900' : 'bg-blue-100'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className={`p-8 rounded-2xl card max-w-sm w-full ${Dark ? 'bg-gray-700' : 'bg-white'}`}>
            <h1 className={`text-2xl font-bold text-center ${Dark ? 'text-blue-400' : 'text-blue-800'} mb-4`}>
              Enter OTP
            </h1>
            <p className={`text-center mb-6 ${Dark ? 'text-gray-300' : 'text-gray-700'}`}>
              Please enter the OTP sent to your email address.
            </p>

            {error && (
              <p className="text-red-500 text-center mb-4">
                {error}
              </p>
            )}

            <div className="mb-4">
              <FancyInput
                label="OTP"
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
              />
            </div>

            <button
              className={`w-full py-2 mt-4 font-medium rounded-xl btn-primary`}
              onClick={handleSubmit}
            >
              Verify OTP
            </button>

            <button
              type="button"
              className={`w-full py-2 mt-3 font-medium rounded-xl ${Dark ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
              onClick={handleResend}
            >
              Resend OTP
            </button>
          </div>
        </motion.div>
      )}
    </form>
  );
};

export default OtpPage;