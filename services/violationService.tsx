import api from "@/lib/api";

export interface Violation {
  id: string;
  inChargeTeacherName: string;
  violateDate: string; // "2026-01-22"
  violationType: string;
  violationLevel: number; // 0 = Nhẹ, 1 = Trung bình, 2 = Nặng
  violationInfo: string;
  penalty: string;
  seenByParent: boolean;
}

export const violationService = {
  // GET danh sách vi phạm
  async getViolations(
    classId: string,
    studentId: string,
    numPage = 1,
    pageSize = 20
  ): Promise<Violation[]> {
    try {
      const res = await api.get(
        `/classes/${classId}/students/${studentId}/violations`,
        {
          params: { numPage, pageSize },
        }
      );
      return res.data || [];
    } catch (error) {
      console.error("Error fetching violations:", error);
      return [];
    }
  },

  // POST xác nhận đã xem - SỬA LẠI THEO CURL
  async markAsSeen(
    violationId: string,
    studentId: string
  ): Promise<boolean> {
    try {
      await api.post(
        `/violations/${violationId}/students/${studentId}/confirm`,
        {} // Body rỗng theo curl -d ''
      );
      return true;
    } catch (error) {
      console.error("Error marking violation as seen:", error);
      return false;
    }
  },
};