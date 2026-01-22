import api from "@/lib/api";
import { ScheduleSettingsResponse } from "@/types/scheduleSettings";

export interface TimetableItem {
  id: string;
  day: number; // 1 = Thứ 2, 7 = CN
  period: number;
  subject: string;
  subjectId: string;
  teacher: string;
  content?: string;
  isMorning: boolean;
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  teacherName: string;
  roomName: string;
  startDate: string;
  endDate: string;
  currentStudentCount: number;
  maxCapacity: number;
  description: string;
}

export interface ScheduleResponse {
  class: ClassInfo;
  classPeriods: TimetableItem[];
}

class ScheduleService {
  // GET
  async getByClassId(classId: string): Promise<TimetableItem[]> {
    try {
      const res = await api.get(`/schedule/${classId}`);
      
      console.log("Schedule API Response:", res.data);

      // Kiểm tra dữ liệu trả về
      if (!res.data || !res.data.classPeriods) {
        console.error("Invalid response structure:", res.data);
        return [];
      }

      return res.data.classPeriods.map((p: any): TimetableItem => ({
        id: p.id,
        day: p.dayOfWeek, // 1 = Thứ 2
        period: p.periodNumber,
        subject: p.subject?.name || "Chưa cập nhật",
        subjectId: p.subject?.id || "",
        teacher: p.teacherName || "Chưa cập nhật",
        content: p.notes,
        isMorning: p.isMorningPeriod,
      }));
    } catch (error) {
      console.error("Error fetching schedule:", error);
      throw error;
    }
  }

  // GET thông tin lớp
  async getClassInfo(classId: string): Promise<ClassInfo | null> {
    try {
      const res = await api.get(`/schedule/${classId}`);
      return res.data.class || null;
    } catch (error) {
      console.error("Error fetching class info:", error);
      return null;
    }
  }

    async getSettings(classId: string): Promise<ScheduleSettingsResponse | null> {
    try {
      const res = await api.get(`/schedule/${classId}/settings`);
      return res.data || null;
    } catch (error) {
      console.error("Error fetching schedule settings:", error);
      return null;
    }
  }
}

export const scheduleService = new ScheduleService();