import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { fundService, type IncomeDetailDto } from "@/services/fundService";

type Props = {
  visible: boolean;
  onClose: () => void;
  classId: string;
  studentId: string;
  incomeTitle?: string;
};

export default function IncomeHistoryModal({
  visible,
  onClose,
  classId,
  studentId,
  incomeTitle,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<IncomeDetailDto[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;

    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setErrorText(null);

        const res = await fundService.getIncomeDetailsByStudent(classId, studentId);
        if (!mounted) return;

        setItems(res.data ?? []);
      } catch (e) {
        if (!mounted) return;
        console.log("Lỗi lấy lịch sử nộp tiền:", e);
        setErrorText("Không tải được lịch sử nộp tiền.");
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [visible, classId, studentId]);

  const totalPaid = useMemo(
    () => items.reduce((acc, x) => acc + (x.contributedAmount ?? 0), 0),
    [items]
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={s.title}>Lịch sử nộp tiền</Text>
              {!!incomeTitle && <Text style={s.subTitle}>{incomeTitle}</Text>}
            </View>

            <Pressable onPress={onClose} style={s.closeBtn}>
              <Ionicons name="close" size={20} color="#111827" />
            </Pressable>
          </View>

          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Tổng đã nộp</Text>
            <Text style={s.summaryValue}>{formatVnd(totalPaid)}</Text>
          </View>

          <View style={s.divider} />

          {loading ? (
            <View style={{ paddingVertical: 16, alignItems: "center" }}>
              <ActivityIndicator />
              <Text style={s.loadingText}>Đang tải...</Text>
            </View>
          ) : errorText ? (
            <Text style={s.errorText}>{errorText}</Text>
          ) : items.length === 0 ? (
            <Text style={s.emptyText}>Chưa có lịch sử nộp tiền.</Text>
          ) : (
            <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ paddingBottom: 8 }}>
              {items.map((x) => (
                <View key={x.id} style={s.itemCard}>
                  <View style={s.itemTop}>
                    <Text style={s.amount}>{formatVnd(x.contributedAmount ?? 0)}</Text>
                    <Text style={s.statusBadge}>{x.contributionStatus}</Text>
                  </View>

                  <Line label="Ngày nộp" value={formatDateOnly(x.contributedAt)} />
                  <Line label="Deadline" value={formatDateOnly(x.deadline)} />

                  {!!x.contributedInfo && (
                    <>
                      <Text style={s.noteLabel}>Thông tin:</Text>
                      <Text style={s.noteText}>{x.contributedInfo}</Text>
                    </>
                  )}

                  {!!x.notes && (
                    <>
                      <Text style={s.noteLabel}>Ghi chú:</Text>
                      <Text style={s.noteText}>{x.notes}</Text>
                    </>
                  )}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.line}>
      <Text style={s.lineLabel}>{label}</Text>
      <Text style={s.lineValue}>{value}</Text>
    </View>
  );
}

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

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 14 },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 16, fontWeight: "900", color: "#111827" },
  subTitle: { marginTop: 2, fontSize: 12, color: "#6B7280", fontWeight: "700" },
  closeBtn: { width: 34, height: 34, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },

  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  summaryLabel: { fontSize: 12, color: "#6B7280", fontWeight: "800" },
  summaryValue: { fontSize: 12, color: "#111827", fontWeight: "900" },

  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 10 },
  loadingText: { marginTop: 8, color: "#6B7280", fontWeight: "700" },
  errorText: { textAlign: "center", color: "#EF4444", fontWeight: "800", paddingVertical: 12 },
  emptyText: { textAlign: "center", color: "#9CA3AF", fontWeight: "700", paddingVertical: 12 },

  itemCard: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 14, padding: 12, marginBottom: 10, backgroundColor: "#F8FAFC" },
  itemTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  amount: { fontSize: 14, fontWeight: "900", color: "#111827" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, fontSize: 11, fontWeight: "900", backgroundColor: "#FEF3C7", color: "#92400E" },

  line: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  lineLabel: { fontSize: 12, color: "#6B7280", fontWeight: "700" },
  lineValue: { fontSize: 12, color: "#111827", fontWeight: "900" },

  noteLabel: { fontSize: 12, color: "#9CA3AF", fontWeight: "900", marginTop: 6 },
  noteText: { fontSize: 13, color: "#374151", lineHeight: 18, marginTop: 4 },
});
