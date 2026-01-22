<<<<<<< Updated upstream
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
=======
import StatCard from "@/components/ui/StatCard";
import { fundService } from "@/services/fundService";
import { ClassFund, FundIncome } from "@/types/fund";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CLASS_ID = "27f5cded-0c8a-4aa0-a099-718ac7434a3b";

export default function ClassFundScreen() {
  const [fund, setFund] = useState<ClassFund | null>(null);
  const [incomes, setIncomes] = useState<FundIncome[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFund();
    fetchIncomes();
  }, []);

  const fetchFund = async () => {
    try {
      const res = await fundService.getClassFund(CLASS_ID);
      setFund(res.data);
    } catch (e) {
      console.log("Lỗi lấy quỹ lớp", e);
    }
  };

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await fundService.getIncomesByClass(CLASS_ID);
      setIncomes(res.data);
    } catch (e) {
      console.log("Lỗi lấy khoản thu", e);
    } finally {
      setLoading(false);
    }
  };

  if (!fund) return null;

  return (
    <ScrollView style={styles.container}>
      {/* ===== SUMMARY ===== */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Tổng quỹ lớp</Text>
        <Text style={styles.totalAmount}>
          {fund.totalContributions.toLocaleString()}đ
        </Text>

        <View style={styles.statRow}>
          <StatCard
            label="Còn lại"
            value={`${fund.currentBalance.toLocaleString()}đ`}
            color="#059669"
          />
          <StatCard
            label="Đã chi"
            value={`${fund.totalExpenses.toLocaleString()}đ`}
            color="#EF4444"
          />
        </View>
      </View>

      {/* ===== LIST ===== */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Danh sách khoản thu
        </Text>
        <Text style={styles.count}>
          {incomes.length} khoản
        </Text>
      </View>

      {loading && <Text>Đang tải...</Text>}

      {!loading &&
        incomes.map((item) => {
          const paid = item.collectedAmount >= item.expectedAmount;

          return (
            <View key={item.id} style={styles.incomeCard}>
              <View style={styles.incomeHeader}>
                <Text style={styles.incomeTitle}>
                  {item.title}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: paid
                        ? "#DCFCE7"
                        : "#FEF3C7",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: paid
                        ? "#166534"
                        : "#92400E",
                      fontSize: 12,
                    }}
                  >
                    {paid ? "Đã nộp" : "Chưa đủ"}
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>
                {item.description}
              </Text>

              <View style={styles.infoRow}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color="#6B7280"
                />
                <Text style={styles.infoText}>
                  Hạn nộp:{" "}
                  {new Date(
                    item.endDate
                  ).toLocaleDateString("vi-VN")}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="cash-outline"
                  size={16}
                  color="#6B7280"
                />
                <Text style={styles.infoText}>
                  {item.collectedAmount.toLocaleString()} /{" "}
                  {item.expectedAmount.toLocaleString()}đ
                </Text>
              </View>
            </View>
          );
        })}
    </ScrollView>
>>>>>>> Stashed changes
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 16,
  },

  summaryCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  summaryTitle: {
    fontSize: 13,
    color: "#065F46",
  },

  totalAmount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#047857",
    marginVertical: 6,
  },

  statRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  count: {
    fontSize: 12,
    color: "#6B7280",
  },

  incomeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  incomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  incomeTitle: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  description: {
    fontSize: 13,
    color: "#6B7280",
    marginVertical: 6,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 13,
  },
});
