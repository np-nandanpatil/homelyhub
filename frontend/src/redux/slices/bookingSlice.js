import axios from 'axios';

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null
};

const FETCH_REQUEST = 'FETCH_REQUEST';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';
const SET_CURRENT_BOOKING = 'SET_CURRENT_BOOKING';
const CLEAR_BOOKINGS = 'CLEAR_BOOKINGS';

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SUCCESS:
      return { ...state, loading: false, bookings: action.payload };
    case FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case SET_CURRENT_BOOKING:
      return { ...state, currentBooking: action.payload };
    case CLEAR_BOOKINGS:
      return { ...state, bookings: [] };
    default:
      return state;
  }
};

export const fetchUserBookings = () => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/bookings/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: FETCH_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error.response?.data?.message || 'Error fetching bookings' });
  }
};

export const fetchPropertyBookings = (propertyId) => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/bookings/property/${propertyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: FETCH_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error.response?.data?.message || 'Error fetching bookings' });
  }
};

export const createBooking = (bookingData) => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/bookings', bookingData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: SET_CURRENT_BOOKING, payload: response.data });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error creating booking';
    dispatch({ type: FETCH_ERROR, payload: message });
    throw error;
  }
};

export const cancelBooking = (bookingId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`/api/bookings/${bookingId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBookingById = (bookingId) => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`/api/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({ type: SET_CURRENT_BOOKING, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error.response?.data?.message || 'Error fetching booking' });
  }
};

export default bookingReducer;
