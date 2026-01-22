import {
  ClassFundDto,
  FundExpenseDto,
  FundIncomeDetailDto,
  FundIncomeDto,
} from "@/types/fund";
import axios from "axios";

const API_URL = "http://20.3.7.11:5102/api/funds";

export const fundService = {
  // ===== TỔNG QUỸ =====
  getClassFund(classId: string) {
    return axios.get<ClassFundDto>(`${API_URL}/${classId}`);
  },

  // ===== KHOẢN THU =====
  getFundIncomes(classId: string) {
    return axios.get<FundIncomeDto[]>(
      `${API_URL}/${classId}/income`
    );
  },

  getStudentIncomeDetails(classId: string, studentId: string) {
    return axios.get<FundIncomeDetailDto[]>(
      `${API_URL}/classes/${classId}/students/${studentId}/income-details`
    );
  },

  getIncomeDetailsByStudent: (
    incomeId: string,
    studentId: string
  ) => axios.get<FundIncomeDetailDto[]>(
      `${API_URL}/income/${incomeId}/details/${studentId}`
    ),

  // ===== KHOẢN CHI =====
  getFundExpenses(
    classId: string,
    startDate?: string,
    endDate?: string
  ) {
    return axios.get<FundExpenseDto[]>(
      `${API_URL}/${classId}/expenses`,
      {
        params: {
          startDate,
          endDate,
        },
      }
    );
  },
};
