export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  if (email.includes(' ')) return false;

  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return false;
  if (email.indexOf('@', atIndex + 1) !== -1) return false;

  const dotIndex = email.indexOf('.', atIndex);
  if (dotIndex === -1) return false;

  if (dotIndex === atIndex + 1 || dotIndex === email.length - 1) return false;

  return true;
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const validatePassword = (password) => {
  return typeof password === 'string'
    && password.length >= 8
    && /[A-Za-z]/.test(password)
    && /\d/.test(password);
};

export const validateDocument = (doc) => {
  return /^\d{6,20}$/.test(doc);
};

export const validateAlphanumeric = (value) => {
  return /^[a-zA-Z0-9]{1,30}$/.test(value);
};

export const validateAge = (birthDateString) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDateString)) return false;
  const [year, month, day] = birthDateString.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) return false;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};

export const validatePlate = (plate, vehicleType = 'car') => {
  if (!plate || typeof plate !== 'string') return false;
  const formattedPlate = plate.toUpperCase().trim();
  const plateRegex = vehicleType === 'moto'
    ? /^[A-Z]{3}[0-9]{2}[A-Z]$/
    : /^[A-Z]{3}[0-9]{3}$/;
  return plateRegex.test(formattedPlate);
};