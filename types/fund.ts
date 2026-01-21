export interface ClassFundDto {
  id: string;
  className: string;
  academicYear: string;
  currentBalance: number;
  totalContributions: number;
  totalExpenses: number;
}

export interface FundIncomeDto {
  id: string;
  title: string;
  expectedAmount: number;
  collectedAmount: number;
  startDate: string;
  endDate: string;
  description: string;
  status: string;
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
