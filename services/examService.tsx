// src/services/fundService.ts
import {
  ClassFundDto,
  FundIncomeDetailDto,
  FundIncomeDto,
} from "@/types/fund";

import api from "@/lib/api";

export const fundService = {
  // Lấy quỹ của lớp
  getClassFund: (classId: string) =>
    api.get<ClassFundDto>(`/funds/${classId}`),

  // Lấy danh sách khoản thu của lớp
  getFundIncomes: (classId: string) =>
    api.get<FundIncomeDto[]>(`/funds/${classId}/income`),

  // Lấy chi tiết đóng quỹ của 1 học sinh
  getStudentIncomeDetails: (classId: string, studentId: string) =>
    api.get<FundIncomeDetailDto[]>(
      `/funds/classes/${classId}/students/${studentId}/income-details`
    ),
};
