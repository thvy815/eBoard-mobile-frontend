import api from "@/lib/api";
import { TeacherInfo } from "@/types/teacher";

export const teacherService = {
  async getTeacherInfo(teacherId: string): Promise<TeacherInfo> {
    const res = await api.get(`/teachers/info/${teacherId}`);
    return res.data;
  },

  // ✅ lấy teacher theo classId
  async getTeacherByClassId(classId: string): Promise<TeacherInfo> {
    const res = await api.get(`/teachers/classes/${classId}`);
    return res.data;
  },
};
