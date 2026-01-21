import FundIncomeItem from "@/components/fund/FundIncomeItem";
import FundStatsRow from "@/components/fund/FundStatsRow";
import FundSummaryCard from "@/components/fund/FundSummaryCard";
import { fundService } from "@/services/fundService";
import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";

export default function ClassFundScreen() {
  console.log("FUND SCREEN RENDERED");

  const classId = "27f5cded-0c8a-4aa0-a099-718ac7434a3b";
  const studentId = "11111111-1111-1111-1111-111111111111";

  const [fund, setFund] = useState<any>(null);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [details, setDetails] = useState<any[]>([]);

  useEffect(() => {
    fundService.getClassFund(classId).then(r => setFund(r.data));
    fundService.getFundIncomes(classId).then(r => setIncomes(r.data));
    fundService
      .getStudentIncomeDetails(classId, studentId)
      .then(r => setDetails(r.data));
  }, []);

  if (!fund) {
    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text>Loading fund...</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16 }}
    >
      <FundSummaryCard fund={fund} />
      <FundStatsRow details={details} />

      <Text style={{ marginTop: 20, fontWeight: "700" }}>
        Danh sách khoản thu
      </Text>

      {incomes.map(i => (
        <FundIncomeItem key={i.id} item={i} />
      ))}
    </ScrollView>
  );
}
