<<<<<<< Updated upstream
// ================= FUND SUMMARY =================
export interface ClassFundDto {
=======
export interface ClassFund {
>>>>>>> Stashed changes
  id: string;
  className: string;
  academicYear: string;
  currentBalance: number;
  totalContributions: number;
  totalExpenses: number;
}
<<<<<<< Updated upstream
export type FundIncomeStatus = "Da thu" | "Dang thu";
// ================= FUND INCOME =================
export interface FundIncomeDto {
=======

export interface FundIncome {
>>>>>>> Stashed changes
  id: string;
  title: string;
  expectedAmount: number;
  collectedAmount: number;
  startDate: string;
  endDate: string;
  description: string;
<<<<<<< Updated upstream
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


=======
  status: string;
}
>>>>>>> Stashed changes
