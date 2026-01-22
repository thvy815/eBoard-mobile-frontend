// src/services/attendanceService.ts
import api from "@/lib/api";

export const attendanceService = {
  // Lấy danh sách đơn xin phép của học sinh trong lớp
  getAbsentRequestsByStudent: (
    studentId: string,
    classId: string
  ) =>
    api.get(
      `/attendance/absent-requests/student/${studentId}/class/${classId}`
    ),

  // Tạo đơn xin phép nghỉ học
  createAbsentRequest: (payload: {
    studentId: string;
    classId: string;
    fromDate: string;
    toDate: string;
    reason: string;
  }) =>
    api.post(`/attendance/absent-request`, {
      StudentId: payload.studentId,
      ClassId: payload.classId,
      FromDate: payload.fromDate,
      ToDate: payload.toDate,
      Reason: payload.reason,
    }),
};
