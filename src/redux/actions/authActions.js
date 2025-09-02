import { toast } from "react-toastify";
import api from "../../api";
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, SAVE_PROFILE } from "./actionTypes";

export const postLoginData = (email, password, navigate) => async (dispatch) => {
  try {
    toast.dismiss();
    dispatch({ type: LOGIN_REQUEST });
    const { data, status } = await api.post('/auth/login', { email, password });
    // Debug: surface backend payload in dev console to diagnose UI issues
    try { console.log('[postLoginData] status', status, 'data', data); } catch {}
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem('token', data.token);
    try { api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`; } catch {}
    toast.success(data.msg);

  }
  catch (error) {
    const status = error.response?.status;
    const backendMsg = error.response?.data?.msg || error.response?.data?.error;
    const msg = backendMsg || error.message;
    try { console.warn('[postLoginData] error status', status, 'data', error.response?.data); } catch {}
    dispatch({
      type: LOGIN_FAILURE,
      payload: { msg }
    })
    toast.error(msg);
    if (status === 403 && /not verified/i.test(msg)) {
      if (email) localStorage.setItem("email", email);
      if (typeof navigate === "function") navigate("/otp");
    }
  }
}



export const saveProfile = (token) => async (dispatch) => {
  try {
    const { data } = await api.get('/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({
      type: SAVE_PROFILE,
      payload: { user: data.user, token },
    });
  }
  catch (error) {
    // console.log(error);
  }
}



export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: LOGOUT });
  try { delete api.defaults.headers.common['Authorization']; } catch {}
  document.location.href = '/';
}