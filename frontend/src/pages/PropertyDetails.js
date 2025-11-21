import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyById } from '../redux/slices/propertySlice';
import { createBooking } from '../redux/slices/bookingSlice';
import '../styles/PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProperty, loading } = useSelector((state) => state.properties);
  const { user, token } = useSelector((state) => state.auth);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchPropertyById(id));
  }, [dispatch, id]);

  const handleImageNavigation = (direction) => {
    if (currentProperty?.images) {
      const maxIndex = currentProperty.images.length - 1;
      if (direction === 'next') {
        setCurrentImageIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setCurrentImageIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!token) {
      navigate('/login');
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (new Date(bookingData.checkOut) <= new Date(bookingData.checkIn)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    try {
      const booking = await dispatch(
        createBooking({
          propertyId: id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: parseInt(bookingData.guests)
        })
      );
      setSuccessMessage('Booking created! Redirecting to payment...');
      setTimeout(() => {
        navigate(`/payment/${booking._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating booking');
    }
  };

  if (loading) return <div className="loading">Loading property details...</div>;
  if (!currentProperty) return <div className="no-results">Property not found</div>;

  const currentImage = currentProperty.images?.[currentImageIndex];
  const imageUrl = currentImage
    ? `http://localhost:5000/uploads/${currentImage}`
    : 'https://via.placeholder.com/800x400?text=Property+Image';

  return (
    <div className="property-details">
      <div className="details-container">
        <div className="image-section">
          <div className="main-image">
            <img
              src={imageUrl}
              alt={currentProperty.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Property+Image';
              }}
            />
            {currentProperty.images?.length > 1 && (
              <>
                <button className="nav-btn prev" onClick={() => handleImageNavigation('prev')}>
                  ❮
                </button>
                <button className="nav-btn next" onClick={() => handleImageNavigation('next')}>
                  ❯
                </button>
              </>
            )}
          </div>
          {currentProperty.images?.length > 1 && (
            <div className="thumbnails">
              {currentProperty.images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000/uploads/${img}`}
                  alt={`Thumb ${idx}`}
                  className={currentImageIndex === idx ? 'active' : ''}
                  onClick={() => setCurrentImageIndex(idx)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x80?text=Thumb';
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="info-section">
          <h1>{currentProperty.title}</h1>
          <p className="location">📍 {currentProperty.location}</p>
          <p className="property-type">Type: {currentProperty.type}</p>

          <div className="property-specs">
            <div className="spec">
              <span className="spec-label">Bedrooms</span>
              <span className="spec-value">{currentProperty.bedrooms}</span>
            </div>
            <div className="spec">
              <span className="spec-label">Bathrooms</span>
              <span className="spec-value">{currentProperty.bathrooms}</span>
            </div>
            <div className="spec">
              <span className="spec-label">Max Guests</span>
              <span className="spec-value">{currentProperty.maxGuests}</span>
            </div>
            <div className="spec">
              <span className="spec-label">Price/Night</span>
              <span className="spec-value">${currentProperty.price}</span>
            </div>
          </div>

          <div className="description-section">
            <h3>About This Property</h3>
            <p>{currentProperty.description}</p>
          </div>

          {currentProperty.amenities?.length > 0 && (
            <div className="amenities-section">
              <h3>Amenities</h3>
              <ul className="amenities-list">
                {currentProperty.amenities.map((amenity, idx) => (
                  <li key={idx}>{amenity}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="host-section">
            <h3>Host Information</h3>
            <p><strong>Name:</strong> {currentProperty.host?.name}</p>
            <p><strong>Email:</strong> {currentProperty.host?.email}</p>
          </div>
        </div>

        <div className="booking-section">
          <div className="booking-card">
            <h2>${currentProperty.price} <span>/night</span></h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={bookingData.checkIn}
                  onChange={handleBookingChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={bookingData.checkOut}
                  onChange={handleBookingChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Number of Guests</label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max={currentProperty.maxGuests}
                  value={bookingData.guests}
                  onChange={handleBookingChange}
                  required
                />
              </div>

              <button type="submit" className="booking-btn">
                {token ? 'Book Now' : 'Sign In to Book'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
