// services/fundService.ts
import api from "@/lib/api";
import type { ClassFundDto, FundExpenseDto, FundIncomeStudent } from "@/types/fund";

export const fundService = {
  // Summary Quỹ lớp
  getClassFundByClassId: (classId: string) =>
    api.get<ClassFundDto>(`/funds/${classId}`),

  // Khoản thu theo PH (theo student)
  getIncomesByStudent: (studentId: string) =>
    api.get<FundIncomeStudent[]>(`/funds/income/${studentId}`),

  // Khoản chi theo lớp (có filter date)
  getExpensesByClass: (
    classId: string,
    params?: {
      pageNumber?: number;
      pageSize?: number;
      startDate?: string; // "YYYY-MM-DD"
      endDate?: string;   // "YYYY-MM-DD"
    }
  ) =>
    api.get<FundExpenseDto[]>(`/funds/${classId}/expenses`, {
      params: {
        pageNumber: params?.pageNumber ?? 1,
        pageSize: params?.pageSize ?? 20,
        startDate: params?.startDate,
        endDate: params?.endDate,
      },
    }),
};
