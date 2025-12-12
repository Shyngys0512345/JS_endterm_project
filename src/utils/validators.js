// src/utils/validators.js

/**
 * Проверяет корректность email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Проверяет сложность пароля
 * - минимум 8 символов
 * - хотя бы 1 цифра
 * - хотя бы 1 спецсимвол (любые)
 */
export const isValidPassword = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return regex.test(password);
};

/**
 * Проверяет совпадение пароля и повторного
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};
