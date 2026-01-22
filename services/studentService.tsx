// src/services/studentService.ts
import api from "@/lib/api";
import { PatchStudentRequest } from "@/types/student";


export const studentService = {
  async patchStudent(studentId: string, payload: PatchStudentRequest): Promise<void> {
    await api.patch(`/students/${studentId}`, payload);
  },
};
