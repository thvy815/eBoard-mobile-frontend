import { ClassFundDto } from "@/types/fund";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FundSummaryCard({ fund }: { fund: ClassFundDto }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Tổng quỹ lớp</Text>
      <Text style={styles.total}>{fund.totalContributions.toLocaleString()}đ</Text>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Còn lại</Text>
          <Text style={styles.green}>{fund.currentBalance.toLocaleString()}đ</Text>
        </View>
        <View>
          <Text style={styles.label}>Đã chi</Text>
          <Text style={styles.red}>{fund.totalExpenses.toLocaleString()}đ</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EAF3F1",
    padding: 16,
    borderRadius: 16,
  },
  title: { fontSize: 13, color: "#6B7280" },
  total: { fontSize: 22, fontWeight: "800", color: "#2563EB" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  label: { fontSize: 12, color: "#6B7280" },
  green: { color: "#059669", fontWeight: "700" },
  red: { color: "#E11D48", fontWeight: "700" },
});
