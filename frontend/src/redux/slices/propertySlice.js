import axios from 'axios';

const initialState = {
  properties: [],
  currentProperty: null,
  loading: false,
  error: null
};

const FETCH_REQUEST = 'FETCH_REQUEST';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';
const SET_CURRENT_PROPERTY = 'SET_CURRENT_PROPERTY';
const CLEAR_CURRENT_PROPERTY = 'CLEAR_CURRENT_PROPERTY';

const propertyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SUCCESS:
      return { ...state, loading: false, properties: action.payload };
    case FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case SET_CURRENT_PROPERTY:
      return { ...state, currentProperty: action.payload, loading: false };
    case CLEAR_CURRENT_PROPERTY:
      return { ...state, currentProperty: null };
    default:
      return state;
  }
};

export const fetchProperties = (filters = {}) => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });
  try {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.amenities) params.append('amenities', filters.amenities);

    const response = await axios.get(`/api/properties?${params}`);
    dispatch({ type: FETCH_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error.response?.data?.message || 'Error fetching properties' });
  }
};

export const fetchPropertyById = (id) => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });
  try {
    const response = await axios.get(`/api/properties/${id}`);
    dispatch({ type: SET_CURRENT_PROPERTY, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error.response?.data?.message || 'Error fetching property' });
  }
};

export const createProperty = (formData) => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/properties', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error creating property';
    dispatch({ type: FETCH_ERROR, payload: message });
    throw error;
  }
};

export const updateProperty = (id, formData) => async (dispatch) => {
  dispatch({ type: FETCH_REQUEST });
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`/api/properties/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error updating property';
    dispatch({ type: FETCH_ERROR, payload: message });
    throw error;
  }
};

export const deleteProperty = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/properties/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw error;
  }
};

export default propertyReducer;
