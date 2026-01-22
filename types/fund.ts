// types/fund.ts

export type ClassFundDto = {
  id: string;
  className: string;
  academicYear: string;
  currentBalance: number;
  totalContributions: number;
  totalExpenses: number;
};

export type FundIncomeStudent = {
  id: string;
  title: string;
  expectedAmount: number;
  paidAmount: number;
  endDate: string; // DateOnly -> string "YYYY-MM-DD"
  description: string;
};

export type FundExpenseDto = {
  classFundId: string;
  title: string;
  amount: number;
  spenderName: string;
  expenseDate: string; // DateOnly -> string "YYYY-MM-DD"
  invoiceImgUrl: string;
  notes: string;
};
