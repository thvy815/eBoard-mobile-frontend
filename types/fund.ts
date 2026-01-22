// types/fund.ts
export type ClassFundDto = {
  totalContributions: number;
  totalExpenses: number;
  currentBalance: number;
};

export type FundIncomeByClassDto = {
  id: string;
  title: string;
  expectedAmount: number;
  amountPerStudent: number;
  collectedAmount: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  description?: string | null;
  status: string;    // "Đang thu"
};

export type FundExpenseDto = {
  id: string;
  classFundId?: string;
  title: string;
  amount: number;
  expenseDate: string; // YYYY-MM-DD
  spenderName?: string | null;
  notes?: string | null;
};

export type FundIncomeHistoryDto = {
  id: string;
  contributedAmount: number;
  contributedInfo?: string | null;
  contributedAt: string; // YYYY-MM-DD
  contributionStatus: string; // e.g. "PARTIAL"
  deadline: string; // YYYY-MM-DD
  notes?: string | null;
};
