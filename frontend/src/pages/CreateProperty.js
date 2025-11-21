import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import '../styles/CreateProperty.css';

const CreateProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    type: 'apartment',
    amenities: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('maxGuests', formData.maxGuests);
      formDataToSend.append('bedrooms', formData.bedrooms);
      formDataToSend.append('bathrooms', formData.bathrooms);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('amenities', formData.amenities);

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      await propertyAPI.create(formDataToSend);
      navigate('/host/properties');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-property-container">
      <div className="property-header">
        <h1>Create New Property</h1>
        <p>List your accommodation on HomelyHub</p>
      </div>

      <form onSubmit={handleSubmit} className="property-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label>Property Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Cozy Modern Apartment in Downtown"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe your property..."
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="City, Country"
              />
            </div>

            <div className="form-group">
              <label>Property Type *</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="room">Room</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Pricing & Capacity</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Price per Night ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="150"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Maximum Guests *</label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                required
                placeholder="4"
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Bedrooms *</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                placeholder="2"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Bathrooms *</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                placeholder="1"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Amenities (comma-separated)</label>
            <textarea
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Kitchen, Parking, Air Conditioning, ..."
              rows="3"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Images</h2>
          <div className="form-group">
            <label>Upload Property Images (up to 10)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>

          {imagePreviews.length > 0 && (
            <div className="image-previews">
              {imagePreviews.map((preview, idx) => (
                <img key={idx} src={preview} alt={`Preview ${idx}`} />
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating Property...' : 'Create Property'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/host/properties')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;
