// Save JWT token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove JWT token (Logout)
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Get user role from JWT
export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    return null;
  }
};
