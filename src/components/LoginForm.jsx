import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { postLoginData } from '../redux/actions/authActions';
import validateManyFields from '../validations';
import FancyInput from './utils/FancyInput';
import Loader from './utils/Loader';

const LoginForm = ({ Dark, setDark, redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const authState = useSelector(state => state.authReducer);
  const { loading, isLoggedIn } = authState;
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || "/");
    }
  }, [isLoggedIn, redirectUrl, navigate]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading || submitting) return;
    const errors = validateManyFields("login", formData);
    setFormErrors({});
    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }
    const normalizedEmail = (formData.email || "").trim().toLowerCase();
    const rawPassword = formData.password ?? ""; // do NOT trim
    try {
      setSubmitting(true);
      await dispatch(postLoginData(normalizedEmail, rawPassword, navigate));
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <form
      className={`m-auto my-16 max-w-[500px] p-8 rounded-2xl card ${Dark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
      onSubmit={handleSubmit}
      noValidate
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className='text-center mb-4'>
            Welcome user, please login here
          </h2>

          <div className="mb-4">
            <FancyInput
              label="Email"
              type="text"
              name="email"
              id="email"
              value={formData.email}
              placeholder="youremail@domain.com"
              onChange={handleChange}
              className={Dark ? 'text-white' : 'text-black'}
              error={formErrors.email}
            />
          </div>

          <div className="mb-4">
            <FancyInput
              label="Password"
              type="password"
              name="password"
              id="password"
              value={formData.password}
              placeholder="Your password.."
              onChange={handleChange}
              className={Dark ? 'text-white' : 'text-black'}
              error={formErrors.password}
            />
          </div>

          <button
            className='btn-primary disabled:opacity-50'
            type="submit"
            disabled={loading || submitting}
          >
            Submit
          </button>

          <div className='pt-4'>
            <Link to="/signup" className={`text-blue-400 ${Dark ? 'text-blue-300' : 'text-blue-400'}`}>
              Don't have an account? Signup here
            </Link>
          </div>
        </>
      )}
    </form>
  );
};

export default LoginForm;