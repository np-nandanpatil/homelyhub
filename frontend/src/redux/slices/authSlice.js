import { authAPI } from '../../services/api';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
};

const AUTH_REQUEST = 'AUTH_REQUEST';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_ERROR = 'AUTH_ERROR';
const LOGOUT = 'LOGOUT';

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTH_SUCCESS:
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token };
    case AUTH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      return { ...state, user: null, token: null };
    default:
      return state;
  }
};

export const register = (name, email, password, role = 'user') => async (dispatch) => {
  dispatch({ type: AUTH_REQUEST });
  try {
    const response = await authAPI.register({ name, email, password, role });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: AUTH_SUCCESS, payload: { user, token } });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Registration failed';
    dispatch({ type: AUTH_ERROR, payload: message });
    throw error;
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: AUTH_REQUEST });
  try {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: AUTH_SUCCESS, payload: { user, token } });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    dispatch({ type: AUTH_ERROR, payload: message });
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch({ type: LOGOUT });
};

export default authReducer;
