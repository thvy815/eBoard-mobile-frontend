import api from "@/lib/api";

export const fundService = {
  getClassFund: (classId: string) =>
    api.get(`/funds/${classId}`),

  getIncomesByClass: (classId: string) =>
    api.get(`/funds/${classId}/income`),
};
