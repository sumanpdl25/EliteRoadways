import axios from "axios";

// Set default axios configuration
axios.defaults.withCredentials = true;

export const checkAdminStatus = async () => {
  try {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return { isAdmin: false, user: null };
    }

    const response = await axios.get("/api/v1/users/profile", {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.data?.user) {
      return { isAdmin: false, user: null };
    }

    const user = response.data.user;
    const isAdmin = user.role?.toLowerCase() === "admin";

    return { isAdmin, user };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false, user: null };
  }
};

export const isAdmin = (user) => {
  return user?.role?.toLowerCase() === "admin";
}; 