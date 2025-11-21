import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../redux/slices/propertySlice';
import '../styles/Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { properties, loading } = useSelector((state) => state.properties);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    amenities: ''
  });

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProperties(filters));
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to HomelyHub</h1>
        <p>Find and book unique places to stay</p>
      </div>

      <div className="search-section">
        <h2>Search Properties</h2>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>

      <div className="properties-section">
        <h2>Available Properties</h2>
        {loading ? (
          <div className="loading">Loading properties...</div>
        ) : !properties || properties.length === 0 ? (
          <div className="no-results">No properties found</div>
        ) : (
          <div className="properties-grid">
            {properties.map((property) => (
              <div key={property._id} className="property-card">
                <div className="property-image">
                  {property.images && property.images[0] ? (
                    <img
                      src={`http://localhost:5000/uploads/${property.images[0]}`}
                      alt={property.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Property+Image';
                      }}
                    />
                  ) : (
                    <img src="https://via.placeholder.com/300x200?text=Property+Image" alt={property.title} />
                  )}
                </div>
                <div className="property-info">
                  <h3>{property.title || 'Untitled Property'}</h3>
                  <p className="location">📍 {property.location || 'Location not specified'}</p>
                  <p className="description">{property.description ? property.description.substring(0, 100) + '...' : 'No description available'}</p>
                  <div className="property-details">
                    <span>{property.bedrooms || 0} Bedrooms</span>
                    <span>{property.bathrooms || 0} Bathrooms</span>
                    <span>Max {property.maxGuests || 0} Guests</span>
                  </div>
                  <div className="property-footer">
                    <span className="price">₹{property.price || 0}/night</span>
                    {property._id ? (
                      <Link to={`/property/${property._id}`} className="view-btn">
                        View Details
                      </Link>
                    ) : (
                      <button className="view-btn" disabled>
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
