import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { propertyAPI } from '../services/api';
import '../styles/HostProperties.css';

const HostProperties = () => {
  const { user } = useSelector((state) => state.auth);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await propertyAPI.getByHost(user.id);
      setProperties(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyAPI.delete(propertyId);
        setProperties(properties.filter((p) => p._id !== propertyId));
      } catch (err) {
        setError('Error deleting property');
      }
    }
  };

  if (loading) return <div className="loading">Loading properties...</div>;

  return (
    <div className="host-properties-container">
      <div className="properties-header">
        <h1>My Properties</h1>
        <Link to="/host/properties/create" className="create-btn">
          ➕ Create New Property
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {properties.length === 0 ? (
        <div className="no-properties">
          <p>You haven't created any properties yet</p>
          <Link to="/host/properties/create" className="create-btn">
            Create Your First Property
          </Link>
        </div>
      ) : (
        <div className="properties-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Price/Night</th>
                <th>Guests</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td className="title">{property.title}</td>
                  <td>{property.location}</td>
                  <td>{property.type}</td>
                  <td>₹{property.price}</td>
                  <td>{property.maxGuests}</td>
                  <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/property/${property._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/host/properties/${property._id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(property._id)}
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
  );
};

export default HostProperties;
