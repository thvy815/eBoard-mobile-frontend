// services/fundService.ts
import api from "@/lib/api";
import type { ClassFundDto, FundExpenseDto } from "@/types/fund";

export type FundIncomeByClassDto = {
  id: string;
  title: string;
  expectedAmount: number;
  amountPerStudent: number;
  collectedAmount: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description?: string | null;
  status: string;
};

// ✅ swagger income-details
export type IncomeDetailDto = {
  id: string;
  contributedAmount: number;
  contributedInfo?: string | null;
  contributedAt: string; // YYYY-MM-DD
  contributionStatus: string; // PARTIAL / FULL...
  deadline: string; // YYYY-MM-DD
  notes?: string | null;

  // ⚠️ nếu backend bạn có field map về income, thêm vào đây để filter chính xác:
  // fundIncomeId?: string;
  // incomeId?: string;
};

export const fundService = {
  // Summary Quỹ lớp
  getClassFundByClassId: (classId: string) =>
    api.get<ClassFundDto>(`/funds/${classId}`),

  // Khoản thu theo lớp
  getIncomesByClass: (classId: string) =>
    api.get<FundIncomeByClassDto[]>(`/funds/${classId}/income`),

  // Khoản chi theo lớp (có filter date)
  getExpensesByClass: (
    classId: string,
    params?: {
      pageNumber?: number;
      pageSize?: number;
      startDate?: string; // "YYYY-MM-DD"
      endDate?: string; // "YYYY-MM-DD"
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

  // ✅ Lịch sử nộp tiền theo học sinh (endpoint bạn đưa)
  getIncomeDetailsByStudent: (classId: string, studentId: string) =>
    api.get<IncomeDetailDto[]>(
      `/classes/${classId}/students/${studentId}/income-details`
    ),
};
