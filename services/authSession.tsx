import api from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const PARENT_ID_KEY = "parentId";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function pickUserIdFromClaims(claims: any): string | null {
  if (!claims) return null;

  // Common keys (ASP.NET / JWT)
  const candidates = [
    "user_id",
    "id",
    "userId",
    "sub",
    "nameid",
    "unique_name",
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  ];

  for (const k of candidates) {
    const v = claims[k];
    if (typeof v === "string" && v.length > 0) return v;
  }

  return null;
}

export const authSession = {
  async saveLoginSession(payload: LoginResponse) {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, payload.accessToken],
      [REFRESH_TOKEN_KEY, payload.refreshToken],
    ]);

    const claims = parseJwt(payload.accessToken);
    const parentId = pickUserIdFromClaims(claims);

    if (parentId) {
      await AsyncStorage.setItem(PARENT_ID_KEY, parentId);
    } else {
      // nếu token không có id -> tuỳ BE, mày có thể fallback gọi endpoint /me nếu có
      await AsyncStorage.removeItem(PARENT_ID_KEY);
    }

    return parentId; // trả ra cho tiện
  },

  async clear() {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, PARENT_ID_KEY]);
  },

  async getAccessToken() {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken() {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async getParentId() {
    return AsyncStorage.getItem(PARENT_ID_KEY);
  },

  // Nếu BE có endpoint refresh, sửa path/body cho đúng
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      // ⚠️ SỬA endpoint này theo BE của mày
      // Ví dụ: POST /api/auth/refresh { refreshToken }
      const res = await api.post<LoginResponse>("/auth/refresh", { refreshToken });

      const { accessToken, refreshToken: newRefresh } = res.data;
      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, newRefresh],
      ]);

      // update parentId theo token mới
      const claims = parseJwt(accessToken);
      const parentId = pickUserIdFromClaims(claims);
      if (parentId) await AsyncStorage.setItem(PARENT_ID_KEY, parentId);

      return accessToken;
    } catch {
      await this.clear();
      return null;
    }
  },
};
