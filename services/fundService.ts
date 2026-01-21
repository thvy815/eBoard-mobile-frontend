import {
    ClassFundDto,
    FundIncomeDetailDto,
    FundIncomeDto,
} from "@/types/fund";

import axios from "axios";

const API_URL = "http://192.168.1.8:5102/api/funds";

export const fundService = {
  getClassFund(classId: string) {
    return axios.get<ClassFundDto>(`${API_URL}/${classId}`);
  },

  getFundIncomes(classId: string) {
    return axios.get<FundIncomeDto[]>(`${API_URL}/${classId}/income`);
  },

  getStudentIncomeDetails(classId: string, studentId: string) {
    return axios.get<FundIncomeDetailDto[]>(
      `${API_URL}/classes/${classId}/students/${studentId}/income-details`
    );
  },
};
