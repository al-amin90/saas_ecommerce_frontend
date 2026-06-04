import Cookies from "js-cookie";

// Set token in cookies
export const setToken = (token: string, expiryDays = 7) => {
  Cookies.set("access_token", token, { expires: expiryDays });
};

// Get token from cookies
export const getToken = () => {
  return Cookies.get("access_token");
};

export const removeToken = () => {
  return Cookies.remove("access_token");
};
