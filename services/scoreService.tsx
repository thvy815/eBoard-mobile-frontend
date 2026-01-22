import api from "@/lib/api";

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  midtermScore: number;
  finalScore: number;
  averageScore: number;
}

export interface ScoreReport {
  studentId: string;
  studentName: string;
  className: string;
  academicYear: string;
  semester: number;
  rank: number;
  rankInClass: string;
  averageScore: number;
  grade: string;
  conduct: string;
  finalGrade: string;
  subjectScores: SubjectScore[];
}

export const scoreService = {
  // GET bảng điểm theo học kỳ
  async getScoresBySemester(
    classId: string,
    studentId: string,
    semester: number
  ): Promise<ScoreReport | null> {
    try {
      const res = await api.get(
        `/score/${classId}/student/${studentId}/scores/${semester}`
      );
      return res.data;
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;

      // 404 "chưa có bảng điểm" → empty state
      if (
        status === 404 &&
        typeof data === "string" &&
        data.includes("Bảng điểm không tồn tại")
      ) {
        return null;
      }

      // các lỗi khác
      console.error("Error fetching scores:", error);
      throw error;
    }
  },
};