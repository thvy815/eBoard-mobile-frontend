import type { FundIncomeByClassDto } from "@/services/fundService";
import { fundService } from "@/services/fundService";
import type { ClassFundDto, FundExpenseDto } from "@/types/fund";

import IncomeHistoryModal from "@/components/fund/IncomeHistoryModal";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/**
 * ✅ MOCK CỨNG ID TẠM THỜI
 */
const MOCK_CLASS_ID = "fc23fd72-6527-47ed-97c5-5e320060f457";
const MOCK_STUDENT_ID = "65f1d4d8-1792-418d-aa56-85ee7e727e22";

type TabKey = "income" | "expense";

export default function FundScreen() {
  const [tab, setTab] = useState<TabKey>("income");

  const [classId] = useState<string>(MOCK_CLASS_ID);
  const [studentId] = useState<string>(MOCK_STUDENT_ID);

  const [summary, setSummary] = useState<ClassFundDto | null>(null);
  const [incomes, setIncomes] = useState<FundIncomeByClassDto[]>([]);
  const [expenses, setExpenses] = useState<FundExpenseDto[]>([]);

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  // modal history
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedIncomeTitle, setSelectedIncomeTitle] = useState<string | undefined>(undefined);

  // Expense filter dates
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [picker, setPicker] = useState<{ open: boolean; mode: "from" | "to" }>({
    open: false,
    mode: "from",
  });

  // 1) Load summary once
  useEffect(() => {
    fetchSummary(classId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Fetch list when tab changes
  useEffect(() => {
    if (tab === "income") fetchIncomesByClass(classId);
    if (tab === "expense") fetchExpenses(classId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const fetchSummary = async (cId: string) => {
    try {
      setLoadingSummary(true);
      const res = await fundService.getClassFundByClassId(cId);
      setSummary(res.data);
    } catch (e) {
      console.log("Lỗi lấy quỹ lớp:", e);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchIncomesByClass = async (cId: string) => {
    try {
      setLoadingList(true);
      const res = await fundService.getIncomesByClass(cId);
      setIncomes(res.data ?? []);
    } catch (e) {
      console.log("Lỗi lấy khoản thu:", e);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchExpenses = async (cId: string) => {
    try {
      setLoadingList(true);
      const res = await fundService.getExpensesByClass(cId, {
        pageNumber: 1,
        pageSize: 50,
      });
      setExpenses(res.data ?? []);
    } catch (e) {
      console.log("Lỗi lấy khoản chi:", e);
    } finally {
      setLoadingList(false);
    }
  };

  // Summary values
  const total = summary?.totalContributions ?? 0;
  const remain = summary?.currentBalance ?? 0;
  const spent = summary?.totalExpenses ?? 0;

  const incomeCount = incomes.length;

  const filteredExpenses = useMemo(() => {
    if (!fromDate && !toDate) return expenses;

    const from = fromDate
      ? new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()).getTime()
      : null;
    const to = toDate
      ? new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()).getTime()
      : null;

    return expenses.filter((x) => {
      if (!x.expenseDate) return true;
      const t = parseDateOnlyToTime(x.expenseDate);
      if (from !== null && t < from) return false;
      if (to !== null && t > to) return false;
      return true;
    });
  }, [expenses, fromDate, toDate]);

  const expenseCount = filteredExpenses.length;

  const expenseTotalFiltered = useMemo(() => {
    return filteredExpenses.reduce((acc, x) => acc + (x.amount ?? 0), 0);
  }, [filteredExpenses]);

  // swap date nếu user chọn ngược
  const normalizeDateRangeIfNeeded = () => {
    if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
      const a = fromDate;
      setFromDate(toDate);
      setToDate(a);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 26 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Quỹ lớp</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <Text style={styles.summaryLabel}>Tổng quỹ lớp</Text>
          {loadingSummary ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.summaryTotal}>{formatVnd(total)}</Text>
          )}
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryBottomRow}>
          <View style={styles.summaryMini}>
            <Text style={styles.miniLabel}>Còn lại</Text>
            <Text style={styles.miniValueGreen}>{formatVnd(remain)}</Text>
          </View>
          <View style={styles.summaryMini}>
            <Text style={styles.miniLabel}>Đã chi</Text>
            <Text style={styles.miniValueRed}>{formatVnd(spent)}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <Pressable
            onPress={() => setTab("expense")}
            style={[
              styles.tabBtn,
              tab === "expense" ? styles.tabActiveRed : styles.tabInactive,
            ]}
          >
            <Ionicons
              name="trending-down-outline"
              size={18}
              color={tab === "expense" ? "#fff" : "#EF4444"}
            />
            <Text
              style={[
                styles.tabText,
                tab === "expense" ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              Báo cáo chi
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setTab("income")}
            style={[
              styles.tabBtn,
              tab === "income" ? styles.tabActiveGreen : styles.tabInactive,
            ]}
          >
            <Ionicons
              name="trending-up-outline"
              size={18}
              color={tab === "income" ? "#fff" : "#047857"}
            />
            <Text
              style={[
                styles.tabText,
                tab === "income" ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              Các khoản thu
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Content */}
      {tab === "income" ? (
        <View style={{ marginTop: 12 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh sách khoản thu</Text>
            <Text style={styles.sectionCount}>{incomeCount} khoản</Text>
          </View>

          {loadingList && <Text style={styles.loadingText}>Đang tải...</Text>}

          {!loadingList && incomes.length === 0 && (
            <Text style={styles.emptyText}>Chưa có khoản thu nào.</Text>
          )}

          {incomes.map((item) => {
            const expected = item.expectedAmount ?? 0;
            const collected = item.collectedAmount ?? 0;
            const isDone = expected > 0 && collected >= expected;

            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <View style={styles.iconCircleGreen}>
                      <Ionicons name="wallet-outline" size={18} color="#047857" />
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>

                  <View style={[styles.badge, isDone ? styles.badgePaid : styles.badgeUnpaid]}>
                    <Text style={styles.badgeText}>{isDone ? "Đã đủ" : item.status}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <InfoLine label="Từ ngày" value={formatDateOnly(item.startDate)} />
                  <InfoLine label="Đến ngày" value={formatDateOnly(item.endDate)} />
                  <InfoLine label="Dự kiến" value={formatVnd(expected)} />
                  <InfoLine label="Đã thu" value={formatVnd(collected)} />
                  <InfoLine label="Mỗi học sinh" value={formatVnd(item.amountPerStudent ?? 0)} />

                  {!!item.description && (
                    <>
                      <Text style={styles.noteLabel}>Mô tả:</Text>
                      <Text style={styles.noteText}>{item.description}</Text>
                    </>
                  )}

                  {/* ✅ Button lịch sử nộp tiền */}
                  <Pressable
                    style={styles.historyBtn}
                    onPress={() => {
                      setSelectedIncomeTitle(item.title);
                      setHistoryOpen(true);
                    }}
                  >
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.historyText}>Lịch sử nộp tiền</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={{ marginTop: 12 }}>
          {/* Filter */}
          <View style={styles.filterCard}>
            <View style={styles.filterHeader}>
              <Ionicons name="calendar-outline" size={18} color="#6B7280" />
              <Text style={styles.filterTitle}>Thời gian</Text>
            </View>

            <View style={styles.filterRow}>
              <Pressable
                style={styles.dateBox}
                onPress={() => setPicker({ open: true, mode: "from" })}
              >
                <Text style={styles.dateLabel}>Từ ngày</Text>
                <Text style={styles.dateValue}>
                  {fromDate ? fromDate.toLocaleDateString("vi-VN") : "Chọn"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.dateBox}
                onPress={() => setPicker({ open: true, mode: "to" })}
              >
                <Text style={styles.dateLabel}>Đến ngày</Text>
                <Text style={styles.dateValue}>
                  {toDate ? toDate.toLocaleDateString("vi-VN") : "Chọn"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.filterActions}>
              <Pressable
                style={styles.resetBtn}
                onPress={() => {
                  setFromDate(null);
                  setToDate(null);
                }}
              >
                <Text style={styles.resetText}>Xoá lọc</Text>
              </Pressable>

              <Pressable
                style={styles.applyBtn}
                onPress={() => {
                  normalizeDateRangeIfNeeded(); // ✅ swap nếu chọn ngược
                }}
              >
                <Text style={styles.applyText}>Áp dụng</Text>
              </Pressable>
            </View>

            {picker.open && (
              <DateTimePicker
                value={(picker.mode === "from" ? fromDate : toDate) ?? new Date()}
                mode="date"
                display="default"
                onChange={(_event, selected) => {
                  setPicker((p) => ({ ...p, open: false }));
                  if (!selected) return;
                  if (picker.mode === "from") setFromDate(selected);
                  else setToDate(selected);
                }}
              />
            )}
          </View>

          {/* Expense list header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Báo cáo chi</Text>
            <Text style={styles.sectionCount}>
              {expenseCount} khoản • {formatVnd(expenseTotalFiltered)}
            </Text>
          </View>

          {loadingList && <Text style={styles.loadingText}>Đang tải...</Text>}

          {!loadingList && filteredExpenses.length === 0 && (
            <Text style={styles.emptyText}>Chưa có khoản chi trong khoảng thời gian này.</Text>
          )}

          {filteredExpenses.map((x, idx) => (
            <View key={`${x.id ?? x.title}-${idx}`} style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View style={styles.iconCircleRed}>
                    <Ionicons name="receipt-outline" size={18} color="#EF4444" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.expenseTitle} numberOfLines={2}>
                      {x.title}
                    </Text>
                    <Text style={styles.expenseSub}>{formatDateOnly(x.expenseDate)}</Text>
                  </View>
                </View>

                <Text style={styles.expenseAmount}>-{formatVnd(x.amount ?? 0)}</Text>
              </View>

              <View style={styles.expenseBody}>
                <InfoLine label="Người chi" value={x.spenderName || "—"} />
                {!!x.notes && (
                  <>
                    <Text style={styles.noteLabel}>Ghi chú:</Text>
                    <Text style={styles.noteText}>{x.notes}</Text>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ✅ Modal lịch sử nộp tiền */}
      <IncomeHistoryModal
        visible={historyOpen}
        onClose={() => setHistoryOpen(false)}
        classId={classId}
        studentId={studentId}
        incomeTitle={selectedIncomeTitle}
      />
    </ScrollView>
  );
}

/* ===== Small UI ===== */
function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

/* ===== Helpers ===== */
function formatVnd(amount: number) {
  const n = Number(amount ?? 0);
  return n.toLocaleString("vi-VN") + "đ";
}

function formatDateOnly(dateOnly?: string | null) {
  if (!dateOnly) return "—";
  const [y, m, d] = String(dateOnly).split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return String(dateOnly);
  return new Date(y, m - 1, d).toLocaleDateString("vi-VN");
}

function parseDateOnlyToTime(dateOnly: string) {
  const [y, m, d] = String(dateOnly).split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return 0;
  return new Date(y, m - 1, d).getTime();
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F5F9", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12, justifyContent: "space-between" },
  backBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E5E7EB" },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },

  summaryCard: { backgroundColor: "#E9FBF4", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#D1FAE5" },
  summaryTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  summaryLabel: { fontSize: 12, color: "#6B7280" },
  summaryTotal: { fontSize: 20, fontWeight: "800", color: "#2563EB" },
  summaryDivider: { height: 1, backgroundColor: "#D1FAE5", marginVertical: 10 },
  summaryBottomRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryMini: { width: "48%" },
  miniLabel: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  miniValueGreen: { fontSize: 14, fontWeight: "700", color: "#059669" },
  miniValueRed: { fontSize: 14, fontWeight: "700", color: "#EF4444" },

  tabRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  tabBtn: { flex: 1, height: 40, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  tabInactive: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB" },
  tabActiveGreen: { backgroundColor: "#047857" },
  tabActiveRed: { backgroundColor: "#EF4444" },
  tabText: { fontSize: 13, fontWeight: "700" },
  tabTextActive: { color: "#fff" },
  tabTextInactive: { color: "#111827" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, marginTop: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: "#111827" },
  sectionCount: { fontSize: 12, color: "#6B7280", fontWeight: "600" },

  loadingText: { textAlign: "center", color: "#6B7280", marginTop: 10 },
  emptyText: { textAlign: "center", color: "#9CA3AF", marginTop: 10 },

  card: { backgroundColor: "#fff", borderRadius: 18, marginBottom: 14, overflow: "hidden", borderWidth: 1, borderColor: "#E5E7EB" },
  cardHeader: { padding: 12, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#F8FAFC" },
  iconCircleGreen: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", marginRight: 10 },
  cardTitle: { fontSize: 14, fontWeight: "800", color: "#111827", flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgePaid: { backgroundColor: "#D1FAE5" },
  badgeUnpaid: { backgroundColor: "#FEF3C7" },
  badgeText: { fontSize: 12, fontWeight: "800", color: "#111827" },
  cardBody: { padding: 12 },

  historyBtn: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 6 },
  historyText: { fontSize: 12, fontWeight: "800", color: "#6B7280" },

  infoLine: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  infoLabel: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  infoValue: { fontSize: 12, color: "#111827", fontWeight: "800" },

  noteLabel: { fontSize: 12, color: "#9CA3AF", marginTop: 6 },
  noteText: { fontSize: 13, color: "#374151", marginTop: 4, lineHeight: 18 },

  filterCard: { backgroundColor: "#fff", borderRadius: 18, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E5E7EB" },
  filterHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  filterTitle: { fontSize: 13, fontWeight: "800", color: "#111827" },
  filterRow: { flexDirection: "row", gap: 10 },
  dateBox: { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 14, padding: 10, borderWidth: 1, borderColor: "#E5E7EB" },
  dateLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "700" },
  dateValue: { marginTop: 4, fontSize: 13, fontWeight: "800", color: "#111827" },
  filterActions: { flexDirection: "row", gap: 10, marginTop: 10 },
  resetBtn: { flex: 1, height: 40, borderRadius: 12, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  resetText: { fontSize: 13, fontWeight: "800", color: "#374151" },
  applyBtn: { flex: 1, height: 40, borderRadius: 12, backgroundColor: "#EF4444", alignItems: "center", justifyContent: "center" },
  applyText: { fontSize: 13, fontWeight: "800", color: "#fff" },

  expenseCard: { backgroundColor: "#fff", borderRadius: 18, marginBottom: 14, overflow: "hidden", borderWidth: 1, borderColor: "#E5E7EB" },
  expenseHeader: { padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFF1F2" },
  iconCircleRed: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center", marginRight: 10 },
  expenseTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },
  expenseSub: { marginTop: 2, fontSize: 12, color: "#6B7280", fontWeight: "600" },
  expenseAmount: { fontSize: 14, fontWeight: "900", color: "#EF4444" },
  expenseBody: { padding: 12 },
});
