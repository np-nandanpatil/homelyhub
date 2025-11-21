import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import bookingReducer from './slices/bookingSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  properties: propertyReducer,
  bookings: bookingReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
