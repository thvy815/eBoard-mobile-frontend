// services/fund/mock.ts
import type { ClassFundDto, FundExpenseDto, FundIncomeByClassDto } from "@/types/fund";

export const MOCK_CLASS_ID = "fc23fd72-6527-47ed-97c5-5e320060f457";

export const mockSummary: ClassFundDto = {
  totalContributions: 540000000,
  totalExpenses: 120000000,
  currentBalance: 420000000,
};

export const mockIncomes: FundIncomeByClassDto[] = [
  {
    id: "019bc563-7ec9-7c2e-9075-1a3416fc87d7",
    title: "Quỹ khuyến học tháng 12",
    expectedAmount: 360000000,
    amountPerStudent: 20000000,
    collectedAmount: 220002,
    startDate: "2026-01-16",
    endDate: "2027-10-31",
    description: "Thu tiền quỹ để chuẩn bị cho phần thưởng cuối học kỳ.",
    status: "Đang thu",
  },
  {
    id: "019bc562-5a2d-79e5-b8cb-ae597643d11e",
    title: "Quỹ khuyến học tháng 11",
    expectedAmount: 180000000,
    amountPerStudent: 10000000,
    collectedAmount: 0,
    startDate: "2026-01-16",
    endDate: "2027-10-31",
    description: "Thu tiền quỹ để chuẩn bị cho phần thưởng cuối học kỳ.",
    status: "Đang thu",
  },
];

export const mockExpenses: FundExpenseDto[] = [
  {
    id: "ex-01",
    classFundId: MOCK_CLASS_ID,
    title: "Mua phần thưởng học kỳ",
    amount: 85000000,
    expenseDate: "2026-01-10",
    spenderName: "Cô Lan",
    notes: "Mua quà + giấy khen",
  },
  {
    id: "ex-02",
    classFundId: MOCK_CLASS_ID,
    title: "In ấn tài liệu",
    amount: 3500000,
    expenseDate: "2026-01-12",
    spenderName: "Cô Mai",
    notes: "In đề + photo tài liệu",
  },
  {
    id: "ex-03",
    classFundId: MOCK_CLASS_ID,
    title: "Chi hoạt động ngoại khóa",
    amount: 31500000,
    expenseDate: "2026-01-18",
    spenderName: "Thầy Nam",
    notes: "Thuê xe + nước uống",
  },
];
