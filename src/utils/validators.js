// src/utils/validators.js

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


export const isValidPassword = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return regex.test(password);
};


export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};
