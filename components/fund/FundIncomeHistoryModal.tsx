import { fundService } from "@/services/fundService";
import { FundIncomeDetailDto } from "@/types/fund";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function FundIncomeHistoryModal({
  visible,
  incomeId,
  studentId,
  onClose,
}: {
  visible: boolean;
  incomeId: string | null;
  studentId: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<
    FundIncomeDetailDto[]
  >([]);

  useEffect(() => {
    if (!incomeId) return;

    setLoading(true);
    fundService
      .getIncomeDetailsByStudent(incomeId, studentId)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [incomeId]);

  const total = data.reduce(
    (s, i) => s + i.contributedAmount,
    0
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Lịch sử nộp tiền
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              {data.map((i) => (
                <View key={i.id} style={styles.card}>
                  <Text style={styles.date}>
                    📅 {i.contributedAt}
                  </Text>

                  <View style={styles.row}>
                    <Text>Số tiền đã nộp</Text>
                    <Text style={styles.amount}>
                      {i.contributedAmount.toLocaleString()}đ
                    </Text>
                  </View>
                </View>
              ))}

              <View style={styles.totalBox}>
                <Text>Tổng đã nộp</Text>
                <Text style={styles.totalAmount}>
                  {total.toLocaleString()}đ
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 16,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontWeight: "700", fontSize: 16 },
  card: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  date: { color: "#64748B", fontSize: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  amount: { fontWeight: "700" },
  totalBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalAmount: {
    fontWeight: "800",
    color: "#DC2626",
  },
});
