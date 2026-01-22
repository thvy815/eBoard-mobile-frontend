// import { fundService } from "@/services/fundService";
// import type { ClassFundDto, FundExpenseDto, FundIncomeStudent } from "@/types/fund";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { router } from "expo-router";
// import { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// /**
//  * TODO: thay bằng classId + studentId lấy từ session của Parent
//  * (ví dụ parentSession.getClassId(), parentSession.getStudentId()...)
//  */
// const CLASS_ID = "fc23fd72-6527-47ed-97c5-5e320060f457";
// const STUDENT_ID = "378e0795-76b9-4436-9a3a-4b466363f47d";

// type TabKey = "income" | "expense";

// export default function FundScreen() {
//   const [tab, setTab] = useState<TabKey>("income");

//   const [summary, setSummary] = useState<ClassFundDto | null>(null);
//   const [incomes, setIncomes] = useState<FundIncomeStudent[]>([]);
//   const [expenses, setExpenses] = useState<FundExpenseDto[]>([]);

//   const [loadingSummary, setLoadingSummary] = useState(false);
//   const [loadingList, setLoadingList] = useState(false);

//   // Expense filter dates
//   const [fromDate, setFromDate] = useState<Date | null>(null);
//   const [toDate, setToDate] = useState<Date | null>(null);
//   const [picker, setPicker] = useState<{ open: boolean; mode: "from" | "to" }>({
//     open: false,
//     mode: "from",
//   });

//   useEffect(() => {
//     fetchSummary();
//   }, []);

//   useEffect(() => {
//     if (tab === "income") fetchIncomes();
//     if (tab === "expense") fetchExpenses();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tab]);

//   const fetchSummary = async () => {
//     try {
//       setLoadingSummary(true);
//       const res = await fundService.getClassFundByClassId(CLASS_ID);
//       setSummary(res.data);
//     } catch (e) {
//       console.log("Lỗi lấy quỹ lớp:", e);
//     } finally {
//       setLoadingSummary(false);
//     }
//   };

//   const fetchIncomes = async () => {
//     try {
//       setLoadingList(true);
//       const res = await fundService.getIncomesByStudent(STUDENT_ID);
//       setIncomes(res.data ?? []);
//     } catch (e) {
//       console.log("Lỗi lấy khoản thu:", e);
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   const fetchExpenses = async () => {
//     try {
//       setLoadingList(true);
//       const res = await fundService.getExpensesByClass(CLASS_ID, {
//         pageNumber: 1,
//         pageSize: 50,
//         startDate: fromDate ? toDateOnly(fromDate) : undefined,
//         endDate: toDate ? toDateOnly(toDate) : undefined,
//       });
//       setExpenses(res.data ?? []);
//     } catch (e) {
//       console.log("Lỗi lấy khoản chi:", e);
//     } finally {
//       setLoadingList(false);
//     }
//   };

//   const total = summary?.totalContributions ?? 0;
//   const remain = summary?.currentBalance ?? 0;
//   const spent = summary?.totalExpenses ?? 0;

//   const incomeCount = incomes.length;
//   const expenseCount = expenses.length;

//   const expenseTotalShown = useMemo(() => {
//     return expenses.reduce((acc, x) => acc + (x.amount ?? 0), 0);
//   }, [expenses]);

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 26 }}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Pressable onPress={() => router.back()} style={styles.backBtn}>
//           <Ionicons name="chevron-back" size={22} color="#111827" />
//         </Pressable>
//         <Text style={styles.headerTitle}>Quỹ lớp</Text>
//         <View style={{ width: 36 }} />
//       </View>

//       {/* Summary Card */}
//       <View style={styles.summaryCard}>
//         <View style={styles.summaryTopRow}>
//           <Text style={styles.summaryLabel}>Tổng quỹ lớp</Text>
//           {loadingSummary ? (
//             <ActivityIndicator />
//           ) : (
//             <Text style={styles.summaryTotal}>{formatVnd(total)}</Text>
//           )}
//         </View>

//         <View style={styles.summaryDivider} />

//         <View style={styles.summaryBottomRow}>
//           <View style={styles.summaryMini}>
//             <Text style={styles.miniLabel}>Còn lại</Text>
//             <Text style={styles.miniValueGreen}>{formatVnd(remain)}</Text>
//           </View>
//           <View style={styles.summaryMini}>
//             <Text style={styles.miniLabel}>Đã chi</Text>
//             <Text style={styles.miniValueRed}>{formatVnd(spent)}</Text>
//           </View>
//         </View>

//         {/* Tabs */}
//         <View style={styles.tabRow}>
//           <Pressable
//             onPress={() => setTab("expense")}
//             style={[styles.tabBtn, tab === "expense" ? styles.tabActiveRed : styles.tabInactive]}
//           >
//             <Ionicons
//               name="trending-down-outline"
//               size={18}
//               color={tab === "expense" ? "#fff" : "#EF4444"}
//             />
//             <Text style={[styles.tabText, tab === "expense" ? styles.tabTextActive : styles.tabTextInactive]}>
//               Báo cáo chi
//             </Text>
//           </Pressable>

//           <Pressable
//             onPress={() => setTab("income")}
//             style={[styles.tabBtn, tab === "income" ? styles.tabActiveGreen : styles.tabInactive]}
//           >
//             <Ionicons
//               name="trending-up-outline"
//               size={18}
//               color={tab === "income" ? "#fff" : "#047857"}
//             />
//             <Text style={[styles.tabText, tab === "income" ? styles.tabTextActive : styles.tabTextInactive]}>
//               Các khoản thu
//             </Text>
//           </Pressable>
//         </View>
//       </View>

//       {/* Content */}
//       {tab === "income" ? (
//         <View style={{ marginTop: 12 }}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Danh sách khoản thu</Text>
//             <Text style={styles.sectionCount}>{incomeCount} khoản</Text>
//           </View>

//           {loadingList && <Text style={styles.loadingText}>Đang tải...</Text>}

//           {!loadingList && incomes.length === 0 && (
//             <Text style={styles.emptyText}>Chưa có khoản thu nào.</Text>
//           )}

//           {incomes.map((item) => {
//             const isPaid = (item.paidAmount ?? 0) >= (item.expectedAmount ?? 0) && (item.expectedAmount ?? 0) > 0;
//             return (
//               <View key={item.id} style={styles.card}>
//                 <View style={styles.cardHeader}>
//                   <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
//                     <View style={styles.iconCircleGreen}>
//                       <Ionicons name="wallet-outline" size={18} color="#047857" />
//                     </View>
//                     <Text style={styles.cardTitle} numberOfLines={2}>
//                       {item.title}
//                     </Text>
//                   </View>

//                   <View style={[styles.badge, isPaid ? styles.badgePaid : styles.badgeUnpaid]}>
//                     <Text style={styles.badgeText}>{isPaid ? "Đã nộp" : "Chưa nộp"}</Text>
//                   </View>
//                 </View>

//                 <View style={styles.cardBody}>
//                   <InfoLine label="Hạn nộp" value={formatDateOnly(item.endDate)} />
//                   <InfoLine label="Số tiền" value={formatVnd(item.expectedAmount)} />

//                   {!!item.description && (
//                     <>
//                       <Text style={styles.noteLabel}>Mô tả:</Text>
//                       <Text style={styles.noteText}>{item.description}</Text>
//                     </>
//                   )}

//                   <Pressable style={styles.linkRow} onPress={() => { /* TODO: navigate detail */ }}>
//                     <Ionicons name="chevron-forward" size={16} color="#6B7280" />
//                     <Text style={styles.linkText}>Xem lịch sử nộp tiền</Text>
//                   </Pressable>

//                   {!isPaid && (
//                     <Pressable style={styles.payNowBtn} onPress={() => { /* TODO: open contribute */ }}>
//                       <Text style={styles.payNowText}>Nộp tiền ngay</Text>
//                     </Pressable>
//                   )}
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       ) : (
//         <View style={{ marginTop: 12 }}>
//           {/* Filter */}
//           <View style={styles.filterCard}>
//             <View style={styles.filterHeader}>
//               <Ionicons name="calendar-outline" size={18} color="#6B7280" />
//               <Text style={styles.filterTitle}>Thời gian</Text>
//             </View>

//             <View style={styles.filterRow}>
//               <Pressable
//                 style={styles.dateBox}
//                 onPress={() => setPicker({ open: true, mode: "from" })}
//               >
//                 <Text style={styles.dateLabel}>Từ ngày</Text>
//                 <Text style={styles.dateValue}>{fromDate ? fromDate.toLocaleDateString("vi-VN") : "Chọn"}</Text>
//               </Pressable>

//               <Pressable
//                 style={styles.dateBox}
//                 onPress={() => setPicker({ open: true, mode: "to" })}
//               >
//                 <Text style={styles.dateLabel}>Đến ngày</Text>
//                 <Text style={styles.dateValue}>{toDate ? toDate.toLocaleDateString("vi-VN") : "Chọn"}</Text>
//               </Pressable>
//             </View>

//             <View style={styles.filterActions}>
//               <Pressable
//                 style={styles.resetBtn}
//                 onPress={() => {
//                   setFromDate(null);
//                   setToDate(null);
//                   fetchExpenses();
//                 }}
//               >
//                 <Text style={styles.resetText}>Xoá lọc</Text>
//               </Pressable>

//               <Pressable style={styles.applyBtn} onPress={fetchExpenses}>
//                 <Text style={styles.applyText}>Áp dụng</Text>
//               </Pressable>
//             </View>

//             {/* DateTimePicker */}
//             {picker.open && (
//               <DateTimePicker
//                 value={(picker.mode === "from" ? fromDate : toDate) ?? new Date()}
//                 mode="date"
//                 display="default"
//                 onChange={(event, selected) => {
//                   // Android: event.type === "dismissed"
//                   setPicker((p) => ({ ...p, open: false }));
//                   if (!selected) return;

//                   if (picker.mode === "from") setFromDate(selected);
//                   else setToDate(selected);
//                 }}
//               />
//             )}
//           </View>

//           {/* Expense list header */}
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Báo cáo chi</Text>
//             <Text style={styles.sectionCount}>
//               {expenseCount} khoản • {formatVnd(expenseTotalShown)}
//             </Text>
//           </View>

//           {loadingList && <Text style={styles.loadingText}>Đang tải...</Text>}

//           {!loadingList && expenses.length === 0 && (
//             <Text style={styles.emptyText}>Chưa có khoản chi trong khoảng thời gian này.</Text>
//           )}

//           {expenses.map((x, idx) => (
//             <View key={`${x.title}-${idx}`} style={styles.expenseCard}>
//               <View style={styles.expenseHeader}>
//                 <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
//                   <View style={styles.iconCircleRed}>
//                     <Ionicons name="receipt-outline" size={18} color="#EF4444" />
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.expenseTitle} numberOfLines={2}>
//                       {x.title}
//                     </Text>
//                     <Text style={styles.expenseSub}>
//                       {formatDateOnly(x.expenseDate)}
//                     </Text>
//                   </View>
//                 </View>

//                 <Text style={styles.expenseAmount}>-{formatVnd(x.amount)}</Text>
//               </View>

//               <View style={styles.expenseBody}>
//                 <InfoLine label="Người chi" value={x.spenderName || "—"} />
//                 {!!x.notes && (
//                   <>
//                     <Text style={styles.noteLabel}>Ghi chú:</Text>
//                     <Text style={styles.noteText}>{x.notes}</Text>
//                   </>
//                 )}
//               </View>
//             </View>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// /* ===== Small UI ===== */
// function InfoLine({ label, value }: { label: string; value: string }) {
//   return (
//     <View style={styles.infoLine}>
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={styles.infoValue}>{value}</Text>
//     </View>
//   );
// }

// /* ===== Helpers ===== */
// function formatVnd(amount: number) {
//   const n = Number(amount ?? 0);
//   return n.toLocaleString("vi-VN") + "đ";
// }

// function formatDateOnly(dateOnly: string) {
//   // dateOnly: "YYYY-MM-DD"
//   if (!dateOnly) return "—";
//   const [y, m, d] = dateOnly.split("-").map((x) => parseInt(x, 10));
//   if (!y || !m || !d) return dateOnly;
//   const dt = new Date(y, m - 1, d);
//   return dt.toLocaleDateString("vi-VN");
// }

// function toDateOnly(d: Date) {
//   // "YYYY-MM-DD"
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const dd = String(d.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }

// /* ===== Styles ===== */
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F1F5F9",
//     padding: 16,
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     justifyContent: "space-between",
//   },
//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   headerTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   summaryCard: {
//     backgroundColor: "#E9FBF4",
//     borderRadius: 18,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: "#D1FAE5",
//   },
//   summaryTopRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "baseline",
//   },
//   summaryLabel: {
//     fontSize: 12,
//     color: "#6B7280",
//   },
//   summaryTotal: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: "#2563EB",
//   },
//   summaryDivider: {
//     height: 1,
//     backgroundColor: "#D1FAE5",
//     marginVertical: 10,
//   },
//   summaryBottomRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   summaryMini: {
//     width: "48%",
//   },
//   miniLabel: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginBottom: 2,
//   },
//   miniValueGreen: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#059669",
//   },
//   miniValueRed: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#EF4444",
//   },

//   tabRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 12,
//   },
//   tabBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   tabInactive: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   tabActiveGreen: {
//     backgroundColor: "#047857",
//   },
//   tabActiveRed: {
//     backgroundColor: "#EF4444",
//   },
//   tabText: {
//     fontSize: 13,
//     fontWeight: "700",
//   },
//   tabTextActive: {
//     color: "#fff",
//   },
//   tabTextInactive: {
//     color: "#111827",
//   },

//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "baseline",
//     marginBottom: 10,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#111827",
//   },
//   sectionCount: {
//     fontSize: 12,
//     color: "#6B7280",
//     fontWeight: "600",
//   },

//   loadingText: {
//     textAlign: "center",
//     color: "#6B7280",
//     marginTop: 10,
//   },
//   emptyText: {
//     textAlign: "center",
//     color: "#9CA3AF",
//     marginTop: 10,
//   },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     marginBottom: 14,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   cardHeader: {
//     padding: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: "#F8FAFC",
//   },
//   iconCircleGreen: {
//     width: 34,
//     height: 34,
//     borderRadius: 12,
//     backgroundColor: "#D1FAE5",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },
//   cardTitle: {
//     fontSize: 14,
//     fontWeight: "800",
//     color: "#111827",
//     flex: 1,
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 999,
//   },
//   badgePaid: {
//     backgroundColor: "#D1FAE5",
//   },
//   badgeUnpaid: {
//     backgroundColor: "#FEF3C7",
//   },
//   badgeText: {
//     fontSize: 12,
//     fontWeight: "800",
//     color: "#111827",
//   },

//   cardBody: {
//     padding: 12,
//   },

//   infoLine: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 6,
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: "#6B7280",
//     fontWeight: "600",
//   },
//   infoValue: {
//     fontSize: 12,
//     color: "#111827",
//     fontWeight: "800",
//   },

//   noteLabel: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     marginTop: 6,
//   },
//   noteText: {
//     fontSize: 13,
//     color: "#374151",
//     marginTop: 4,
//     lineHeight: 18,
//   },

//   linkRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 10,
//     paddingVertical: 6,
//   },
//   linkText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#6B7280",
//   },

//   payNowBtn: {
//     marginTop: 10,
//     backgroundColor: "#047857",
//     height: 40,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   payNowText: {
//     color: "#fff",
//     fontWeight: "800",
//     fontSize: 13,
//   },

//   // Expense UI
//   filterCard: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   filterHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 10,
//   },
//   filterTitle: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#111827",
//   },
//   filterRow: {
//     flexDirection: "row",
//     gap: 10,
//   },
//   dateBox: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//     borderRadius: 14,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   dateLabel: {
//     fontSize: 11,
//     color: "#9CA3AF",
//     fontWeight: "700",
//   },
//   dateValue: {
//     marginTop: 4,
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#111827",
//   },
//   filterActions: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 10,
//   },
//   resetBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   resetText: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#374151",
//   },
//   applyBtn: {
//     flex: 1,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: "#EF4444",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   applyText: {
//     fontSize: 13,
//     fontWeight: "800",
//     color: "#fff",
//   },

//   expenseCard: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     marginBottom: 14,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   expenseHeader: {
//     padding: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#FFF1F2",
//   },
//   iconCircleRed: {
//     width: 34,
//     height: 34,
//     borderRadius: 12,
//     backgroundColor: "#FEE2E2",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },
//   expenseTitle: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: "#111827",
//   },
//   expenseSub: {
//     marginTop: 2,
//     fontSize: 12,
//     color: "#6B7280",
//     fontWeight: "600",
//   },
//   expenseAmount: {
//     fontSize: 14,
//     fontWeight: "900",
//     color: "#EF4444",
//   },
//   expenseBody: {
//     padding: 12,
//   },
// });