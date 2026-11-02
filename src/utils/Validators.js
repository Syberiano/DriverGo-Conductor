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

export const validateDocument = (doc) => {
  return /^\d{6,10}$/.test(doc);
};

export const validateAge = (birthDateString) => {
  const birthDate = new Date(birthDateString);
  if (isNaN(birthDate.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};

export const validatePlate = (plate) => {
  if (!plate || typeof plate !== 'string') return false;
  const formattedPlate = plate.toUpperCase().trim();
  const plateRegex = /^[A-Z]{3}\d{3}$/;
  return plateRegex.test(formattedPlate);
};