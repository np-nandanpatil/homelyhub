import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookingById } from '../redux/slices/bookingSlice';
import { paymentAPI } from '../services/api';
import '../styles/PaymentPage.css';

const PaymentForm = ({ booking }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Create order on backend
      const orderResponse = await paymentAPI.createOrder(booking._id);
      const { orderId, amount, currency, key } = orderResponse.data;

      // Step 2: Initialize Razorpay
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        order_id: orderId,
        name: 'HomelyHub',
        description: `Booking for ${booking.property.title}`,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            const verifyResponse = await paymentAPI.verifyPayment({
              bookingId: booking._id,
              razorpayOrderId: orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyResponse.data) {
              navigate('/bookings');
            }
          } catch (err) {
            setError('Payment verification failed');
            setLoading(false);
          }
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      // Step 4: Open Razorpay payment window
      const Razorpay = window.Razorpay;
      if (Razorpay) {
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      } else {
        setError('Razorpay script not loaded');
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment order');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="payment-form">
      {error && <div className="error-message">{error}</div>}

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <div className="summary-item">
          <span>Property:</span>
          <span>{booking?.property?.title}</span>
        </div>
        <div className="summary-item">
          <span>Check-in:</span>
          <span>{new Date(booking?.checkIn).toLocaleDateString()}</span>
        </div>
        <div className="summary-item">
          <span>Check-out:</span>
          <span>{new Date(booking?.checkOut).toLocaleDateString()}</span>
        </div>
        <div className="summary-item">
          <span>Total Amount:</span>
          <span className="amount">₹{booking?.totalPrice}</span>
        </div>
      </div>

      <button type="submit" disabled={loading} className="pay-btn">
        {loading ? 'Processing...' : `Pay ₹${booking?.totalPrice}`}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const { currentBooking, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookingById(bookingId));
  }, [dispatch, bookingId]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  if (loading) return <div className="loading">Loading booking details...</div>;

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>Complete Your Payment</h1>
        <p>Secure payment powered by Razorpay</p>
      </div>

      <div className="payment-content">
        <PaymentForm booking={currentBooking} />
      </div>
    </div>
  );
};

export default PaymentPage;
