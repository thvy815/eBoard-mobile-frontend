import { FundIncomeDetailDto } from "@/types/fund";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FundStatsRow({ details }: { details: FundIncomeDetailDto[] }) {
  const paid = details.filter(d => d.contributedAmount > 0);
  const unpaid = details.filter(d => d.contributedAmount === 0);

  return (
    <View style={styles.row}>
      <View style={styles.box}>
        <Text style={styles.label}>Đã nộp</Text>
        <Text style={styles.value}>{paid.length} khoản</Text>
      </View>

      <View style={[styles.box, styles.warn]}>
        <Text style={styles.label}>Chưa nộp</Text>
        <Text style={styles.value}>{unpaid.length} khoản</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginTop: 14 },
  box: {
    flex: 1,
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 14,
  },
  warn: { backgroundColor: "#FFF7ED" },
  label: { fontSize: 12, color: "#6B7280" },
  value: { fontWeight: "700", fontSize: 14 },
});
