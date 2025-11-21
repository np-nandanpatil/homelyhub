import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserBookings, cancelBooking } from '../redux/slices/bookingSlice';
import '../styles/Bookings.css';

const Bookings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking(bookingId));
        setMessage('Booking cancelled successfully');
        dispatch(fetchUserBookings());
      } catch (err) {
        setError(err.response?.data?.message || 'Error cancelling booking');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status || 'pending') {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>View and manage your reservations</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You haven't made any bookings yet</p>
          <a href="/" className="browse-btn">Browse Properties</a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-image">
                {booking.property?.images?.[0] ? (
                  <img
                    src={`http://localhost:5000/uploads/${booking.property.images[0]}`}
                    alt={booking.property.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x150?text=Property';
                    }}
                  />
                ) : (
                  <img src="https://via.placeholder.com/200x150?text=Property" alt="Property" />
                )}
              </div>

              <div className="booking-info">
                <h3>{booking.property?.title}</h3>
                <p className="location">📍 {booking.property?.location}</p>
                
                <div className="booking-details">
                  <div className="detail">
                    <span className="label">Check-in</span>
                    <span className="value">{formatDate(booking.checkIn)}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Check-out</span>
                    <span className="value">{formatDate(booking.checkOut)}</span>
                  </div>
                  <div className="detail">
                    <span className="label">Guests</span>
                    <span className="value">{booking.guests}</span>
                  </div>
                </div>

                <div className="booking-footer">
                  <div className="price-status">
                    <span className="total-price">₹{booking.totalPrice}</span>
                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                      {(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}
                    </span>
                  </div>

                  <div className="booking-actions">
                    {(booking.status || 'pending') === 'pending' && (
                      <>
                        <button
                          className="pay-btn"
                          onClick={() => navigate(`/payment/${booking._id}`)}
                        >
                          Complete Payment
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {(booking.status || 'pending') !== 'cancelled' && (booking.status || 'pending') !== 'pending' && (
                      <button
                        className="cancel-btn"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
