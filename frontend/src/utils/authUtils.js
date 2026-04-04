import axios from "axios";

export const syncUserProfile = async () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    const { token } = JSON.parse(storedUser);
    if (!token) return null;

    const response = await axios.get("http://localhost:5000/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      const updatedUser = { ...response.data, token };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      return updatedUser;
    }
  } catch (error) {
    console.error("Failed to sync user profile:", error);
    if (error.response?.status === 401) {
      // Token expired or invalid
      // localStorage.removeItem("user");
      // window.location.href = "/login";
    }
  }
  return null;
};
