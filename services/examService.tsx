// src/services/examService.ts
import api from "@/lib/api";

export const examService = {
  getByClass: (
    classId: string,
    params?: {
      from?: string;
      to?: string;
      subjectId?: string;
      examFormat?: string;
    }
  ) =>
    api.get(`/exams-schedule/classes/${classId}`, {
      params: {
        From: params?.from,
        To: params?.to,
        SubjectId: params?.subjectId,
        ExamFormat: params?.examFormat,
      },
    }),
};
