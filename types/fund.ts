// ================= FUND SUMMARY =================
export interface ClassFundDto {
  id: string;
  className: string;
  academicYear: string;
  currentBalance: number;
  totalContributions: number;
  totalExpenses: number;
}
export type FundIncomeStatus = "Da thu" | "Dang thu";
// ================= FUND INCOME =================
export interface FundIncomeDto {
  id: string;
  title: string;
  expectedAmount: number;
  collectedAmount: number;
  startDate: string;
  endDate: string;
  description: string;
  status: FundIncomeStatus;
}

export interface FundIncomeDetailDto {
  id: string;
  contributedAmount: number;
  contributedInfo: string;
  contributedAt: string;
  contributionStatus: string;
  deadline: string;
  notes: string;
}

// ================= FUND EXPENSE =================
export interface FundExpenseDto {
  id: string;
  title: string;
  amount: number;
  expenseDate: string;
  spenderName: string;
  notes: string;
}


