import { FundIncomeDto } from "@/types/fund";
import { Clock } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FundIncomeItem({
  item,
  onPressHistory,
}: {
  item: FundIncomeDto;
  onPressHistory: (incomeId: string) => void;
}) {
  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
      </View>

      {/* INFO */}
      <View style={styles.row}>
        <Text style={styles.icon}>📅</Text>
        <Text style={styles.text}>
          Hạn nộp: {item.endDate}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.icon}>💰</Text>
        <Text style={styles.text}>
          Số tiền:{" "}
          {item.expectedAmount.toLocaleString()}đ
        </Text>
      </View>

      {/* HISTORY */}
      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => onPressHistory(item.id)}
      >
        <Clock size={16} color="#64748B" />
        <Text style={styles.historyText}>
          Xem lịch sử nộp tiền
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  header: { marginBottom: 4 },
  title: { fontWeight: "700", fontSize: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  icon: { marginRight: 6 },
  text: { fontSize: 12, color: "#6B7280" },
  historyBtn: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  historyText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
});
