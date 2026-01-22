import FundExpenseItem from "@/components/fund/FundExpenseItem";
import FundIncomeHistoryModal from "@/components/fund/FundIncomeHistoryModal";
import FundIncomeItem from "@/components/fund/FundIncomeItem";
import FundStatsRow from "@/components/fund/FundStatsRow";
import FundSummaryCard from "@/components/fund/FundSummaryCard";
import { fundService } from "@/services/fundService";
import {
  ClassFundDto,
  FundExpenseDto,
  FundIncomeDetailDto,
  FundIncomeDto,
} from "@/types/fund";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "income" | "expense";

export default function ClassFundScreen() {
  const classId = "fc23fd72-6527-47ed-97c5-5e320060f457";
  const studentId = "50c8948a-c091-4a45-b308-23f694fc6218";

  const [fund, setFund] = useState<ClassFundDto | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("income");

  const [incomes, setIncomes] = useState<FundIncomeDto[]>([]);
  const [expenses, setExpenses] = useState<FundExpenseDto[]>([]);
  const [details, setDetails] = useState<FundIncomeDetailDto[]>([]);
  const [selectedIncomeId, setSelectedIncomeId] = useState<string | null>(null);

  useEffect(() => {
    fundService.getClassFund(classId).then(r => setFund(r.data));
    fundService
      .getStudentIncomeDetails(classId, studentId)
      .then(r => setDetails(r.data));
  }, []);

  useEffect(() => {
    if (activeTab === "income") {
      fundService
        .getFundIncomes(classId)
        .then(r => setIncomes(r.data));
    } else {
      fundService
        .getFundExpenses(classId)
        .then(r => setExpenses(r.data));
    }
  }, [activeTab]);

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
      {/* SUMMARY */}
      <FundSummaryCard fund={fund} />

      {/* STATS chỉ áp dụng cho khoản thu */}
      {activeTab === "income" && (
        <FundStatsRow details={details} />
      )}

      {/* TABS */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          backgroundColor: "#F3F4F6",
          borderRadius: 14,
        }}
      >
        <TabButton
          title="Khoản thu"
          active={activeTab === "income"}
          onPress={() => setActiveTab("income")}
        />
        <TabButton
          title="Khoản chi"
          active={activeTab === "expense"}
          onPress={() => setActiveTab("expense")}
        />
      </View>

      {/* CONTENT */}
      <Text style={{ marginTop: 16, fontWeight: "700" }}>
        {activeTab === "income"
          ? "Danh sách khoản thu"
          : "Báo cáo chi"}
      </Text>

      {activeTab === "income" &&
        incomes.map(i => (
          <FundIncomeItem key={i.id} item={i} onPressHistory={setSelectedIncomeId}/>
        ))}

      <FundIncomeHistoryModal
        visible={!!selectedIncomeId}
        incomeId={selectedIncomeId}
        studentId={studentId}
        onClose={() => setSelectedIncomeId(null)}
      />

      {activeTab === "expense" &&
        expenses.map(e => (
          <FundExpenseItem key={e.id} item={e} />
        ))}
    </ScrollView>
  );
}

/* ================= TAB BUTTON ================= */

function TabButton({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: active ? "#F43F5E" : "transparent",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: active ? "#fff" : "#6B7280",
          fontWeight: "700",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
