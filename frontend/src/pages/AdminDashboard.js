import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    else if (activeTab === 'properties') loadProperties();
    else if (activeTab === 'bookings') loadBookings();
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError('Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Error loading users');
    }
  };

  const loadProperties = async () => {
    try {
      const response = await adminAPI.getProperties();
      setProperties(response.data);
    } catch (err) {
      setError('Error loading properties');
    }
  };

  const loadBookings = async () => {
    try {
      const response = await adminAPI.getBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Error loading bookings');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        loadUsers();
      } catch (err) {
        setError('Error deleting user');
      }
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await adminAPI.deleteProperty(propertyId);
        loadProperties();
      } catch (err) {
        setError('Error deleting property');
      }
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await adminAPI.deleteBooking(bookingId);
        loadBookings();
      } catch (err) {
        setError('Error deleting booking');
      }
    }
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        {activeTab === 'dashboard' && dashboard && (
          <div className="dashboard-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value">{dashboard.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Properties</h3>
              <p className="stat-value">{dashboard.totalProperties}</p>
            </div>
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-value">{dashboard.totalBookings}</p>
            </div>
            <div className="stat-card">
              <h3>Confirmed Bookings</h3>
              <p className="stat-value">{dashboard.confirmedBookings}</p>
            </div>
            <div className="stat-card full-width">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{dashboard.totalRevenue.toFixed(2)}</p>
            </div>

            <div className="recent-bookings full-width">
              <h3>Recent Bookings</h3>
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Property</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentBookings?.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.user?.name}</td>
                      <td>{booking.property?.title}</td>
                      <td>₹{booking.totalPrice}</td>
                      <td>
                        <span className={`status-badge status-${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>{user.phone || '-'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Host</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property._id}>
                    <td>{property.title}</td>
                    <td>{property.location}</td>
                    <td>{property.type}</td>
                    <td>₹{property.price}</td>
                    <td>{property.host?.name}</td>
                    <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteProperty(property._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Property</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.user?.name}</td>
                    <td>{booking.property?.title}</td>
                    <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                    <td>₹{booking.totalPrice}</td>
                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteBooking(booking._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
