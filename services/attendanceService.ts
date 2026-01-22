import api from "@/lib/api";
import { AbsentRequestDto, CreateAbsentRequestDto } from "@/types/attendance";

export const attendanceService = {

  // GET danh sách đơn xin phép
  getStudentAbsentRequests(studentId: string, classId: string) {
    return api.get<AbsentRequestDto[]>(
      `/attendance/absent-requests/student/${studentId}/class/${classId}`
    );
  },

  // POST tạo đơn xin phép
  createAbsentRequest(payload: CreateAbsentRequestDto) {
  return api.post(`/attendance/absent-request`, {
    studentId: payload.studentId,
    classId: payload.classId,
    fromDate: payload.fromDate,
    toDate: payload.toDate,
    reason: payload.reason,
    notes: payload.notes || ""
  });
},

getAbsenceNotifications(studentId: string) {
  return api.get(`/notifications/absence/student/${studentId}`);
}
};
