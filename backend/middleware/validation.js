const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateBookingDates = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return checkInDate > today && checkOutDate > checkInDate;
};

const validatePropertyData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required');
  }
  if (!data.location || data.location.trim().length === 0) {
    errors.push('Location is required');
  }
  if (!data.price || isNaN(data.price) || parseFloat(data.price) <= 0) {
    errors.push('Valid price is required');
  }
  if (!data.maxGuests || isNaN(data.maxGuests) || parseInt(data.maxGuests) <= 0) {
    errors.push('Valid number of guests is required');
  }
  if (!data.bedrooms || isNaN(data.bedrooms) || parseInt(data.bedrooms) < 0) {
    errors.push('Valid number of bedrooms is required');
  }
  if (!data.bathrooms || isNaN(data.bathrooms) || parseInt(data.bathrooms) < 0) {
    errors.push('Valid number of bathrooms is required');
  }
  if (!['apartment', 'house', 'villa', 'room'].includes(data.type)) {
    errors.push('Invalid property type');
  }

  return errors;
};

const validateUserData = (data) => {
  const errors = [];

  if (data.name && data.name.trim().length === 0) {
    errors.push('Name cannot be empty');
  }
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }
  if (data.phone && !/^[0-9]{10,}$/.test(data.phone)) {
    errors.push('Invalid phone number');
  }

  return errors;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateBookingDates,
  validatePropertyData,
  validateUserData
};
