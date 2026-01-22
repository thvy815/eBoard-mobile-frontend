import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

/**
 * Axios instance dùng chung cho toàn bộ app
 */
const api = axios.create({

  baseURL: "http://20.3.7.11:5102/api", // <--- Đổi thành IP của máy bạn


  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= INTERCEPTORS ================= */

// ===== Helpers =====
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

async function clearSession() {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, "parentId"]);
}

/**
 * ⚠️ SỬA endpoint refresh theo BE của mày (nếu khác)
 * Ví dụ thường gặp:
 * - POST /auth/refresh { refreshToken }
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  try {
    // Dùng axios "thô" để tránh dính interceptor lặp vô hạn
    const res = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" }, timeout: 15000 }
    );

    const accessToken = res?.data?.accessToken as string | undefined;
    const newRefreshToken = res?.data?.refreshToken as string | undefined;

    if (!accessToken || !newRefreshToken) return null;

    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, newRefreshToken],
    ]);

    return accessToken;
  } catch (e) {
    return null;
  }
}

// Request: gắn token
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: log + auto refresh khi 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ❌ Xử lý lỗi tập trung
    if (error.response) {
      console.log("API error:", error.response.data);
    } else {
      console.log("Network error:", error.message);
    }

    const originalRequest = error.config;

    // Nếu 401 => thử refresh 1 lần rồi call lại request
    if (error?.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // đang refresh rồi thì đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token) => {
            if (!token) return reject(error);
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        flushQueue(newToken);

        if (!newToken) {
          await clearSession();
          return Promise.reject(error);
        }

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
