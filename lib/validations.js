export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (fields) => {
  return Object.entries(fields).every(([key, value]) => value?.toString().trim());
};

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().slice(0, 1000);
  }
  return input;
};

export const validatePrice = (price) => {
  return typeof price === 'number' && price >= 0 && price < 1000000;
};

export const validateQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0 && quantity <= 1000;
};

export const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
