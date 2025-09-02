import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

const Task = ({ Dark, setDark }) => {
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? 'add' : 'update';
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    tillDate: '',
    atWhatTime: '',
    reminders: [],
    recurrence: 'none'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === 'add' ? 'Add Task' : 'Edit Task';
  }, [mode]);

  useEffect(() => {
    if (mode === 'update') {
      const config = { url: `/tasks/${taskId}`, method: 'get', headers: { Authorization: `Bearer ${authState.token}` } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({
          description: data.task.description,
          tillDate: data.task.tillDate,
          atWhatTime: data.task.atWhatTime,
          reminders: data.task.reminders || [],
          recurrence: data.task.recurrence || 'none'
        });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so add 1
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setFormData({
      description: task.description,
      tillDate: task.tillDate,
      atWhatTime: task.atWhatTime
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields('task', formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    if (mode === 'add') {
      const config = { url: '/tasks', method: 'post', data: formData, headers: { Authorization: `Bearer ${authState.token}` } };
      fetchData(config).then(() => {
        navigate('/');
      });
    } else {
      const config = { url: `/tasks/${taskId}`, method: 'put', data: formData, headers: { Authorization: `Bearer ${authState.token}` } };
      fetchData(config).then(() => {
        navigate('/');
      });
    }
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-red-500 text-sm ${formErrors[field] ? 'block' : 'hidden'}`}>
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <MainLayout Dark={Dark} setDark={setDark}>
      {/* Page Background */}
      <motion.div
        className={`min-h-screen py-12 ${Dark ? 'bg-gray-800' : 'bg-blue-100'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={`max-w-md mx-auto text-center ${Dark ? 'text-white' : 'text-black'}`}>
          {/* Form Section */}
          <motion.form
            className={`m-auto my-16 max-w-[700px] p-8 rounded-2xl card ${Dark ? 'bg-gray-700 border-gray-600' : 'bg-white'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <motion.h2
                  className={`text-center text-2xl font-bold mb-6 ${Dark ? 'text-blue-300' : 'text-blue-600'}`}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {mode === 'add' ? 'Add New Task' : 'Edit Task'}
                </motion.h2>

                <div className="mb-6">
                  <label htmlFor="description" className={`block text-lg font-medium mb-2 ${Dark ? 'text-white' : 'text-black'}`}>
                    Task Description
                  </label>
                  <Textarea
                    type="description"
                    name="description"
                    id="description"
                    value={formData.description}
                    placeholder="Write your task here..."
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {fieldError('description')}
                </div>

                {/* Till Date Field */}
                <div className="mb-6">
                  <label htmlFor="tillDate" className={`block text-lg font-medium mb-2 ${Dark ? 'text-white' : 'text-black'}`}>
                    Till Date
                  </label>
                  <input
                    type="date"
                    name="tillDate"
                    id="tillDate"
                    value={formatDate(new Date(formData.tillDate))}
                    onChange={handleChange}
                    style={{
                      color: "black"
                    }}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {fieldError('tillDate')}
                </div>

                {/* At What Time Field */}
                <div className="mb-6">
                  <label htmlFor="atWhatTime" className={`block text-lg font-medium mb-2 ${Dark ? 'text-white' : 'text-black'}`}>
                    At What Time
                  </label>
                  <input
                    type="time"
                    name="atWhatTime"
                    id="atWhatTime"
                    value={formData.atWhatTime}
                    onChange={handleChange}
                    style={{
                      color: "black"
                    }}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {fieldError('atWhatTime')}
                </div>

                {/* Reminders Field */}
                <div className="mb-6">
                  <label className={`block text-lg font-medium mb-2 ${Dark ? 'text-white' : 'text-black'}`}>
                    Reminders (minutes before)
                  </label>
                  <input
                    type="text"
                    name="reminders"
                    value={(formData.reminders || []).join(',')}
                    onChange={(e) => {
                      const values = e.target.value
                        .split(',')
                        .map(v => v.trim())
                        .filter(v => v !== '')
                        .map(v => Number(v))
                        .filter(v => !Number.isNaN(v) && v >= 0);
                      setFormData({ ...formData, reminders: values });
                    }}
                    placeholder="e.g. 5,15,60"
                    style={{ color: 'black' }}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Recurrence Field */}
                <div className="mb-6">
                  <label className={`block text-lg font-medium mb-2 ${Dark ? 'text-white' : 'text-black'}`}>
                    Repeat
                  </label>
                  <select
                    name="recurrence"
                    value={formData.recurrence}
                    onChange={handleChange}
                    style={{ color: 'black' }}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="none">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex justify-center gap-4">
                  <motion.button
                    className={`btn-primary`}
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {mode === 'add' ? 'Add Task' : 'Update Task'}
                  </motion.button>

                  <motion.button
                    className={`px-6 py-3 font-medium rounded-xl shadow-elev-1 hover:shadow-elev-2 ${Dark ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                    onClick={() => navigate('/')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>

                  {mode === 'update' && (
                    <motion.button
                      className={`px-6 py-3 font-medium rounded-xl shadow-elev-1 hover:shadow-elev-2 ${Dark ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
                      onClick={handleReset}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Reset
                    </motion.button>
                  )}
                </div>
              </>
            )}
          </motion.form>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Task;