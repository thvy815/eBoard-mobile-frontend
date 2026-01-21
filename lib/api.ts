import axios from "axios";

/**
 * Axios instance dùng chung cho toàn bộ app
 */
const api = axios.create({
  baseURL: "http://192.168.1.39:5102/api", // <--- Đổi thành IP của máy bạn
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= INTERCEPTORS ================= */

// Request
api.interceptors.request.use(
  async (config) => {
    // 🔐 Nếu có token thì gắn vào đây
    // const token = await AsyncStorage.getItem("accessToken");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❌ Xử lý lỗi tập trung
    if (error.response) {
      console.log("API error:", error.response.data);
    } else {
      console.log("Network error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
