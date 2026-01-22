// src/services/authService.ts
import api from "@/lib/api"; // đường dẫn tới file axios bạn gửi

export type ParentLoginRequest = {
  phoneNumber: string;
  password: string;
};

export type ParentLoginResponse = {
  accessToken?: string;
  refreshToken?: string;
  parentId?: string;
  phoneNumber?: string;
  [key: string]: any;
};

export const authService = {
  /**
   * Đăng nhập phụ huynh
   * POST /api/auth/parent/login
   */
  async parentLogin(
    payload: ParentLoginRequest
  ): Promise<ParentLoginResponse> {
    const res = await api.post<ParentLoginResponse>(
      "/auth/parent/login",
      payload
    );

    return res.data;
  },
};
