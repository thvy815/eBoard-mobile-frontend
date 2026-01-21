import { FundIncomeDto } from "@/types/fund";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FundIncomeItem({ item }: { item: FundIncomeDto }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.badge}>{item.status}</Text>
      </View>

      <Text style={styles.text}>Hạn nộp: {item.endDate}</Text>
      <Text style={styles.text}>
        Số tiền: {item.expectedAmount.toLocaleString()}đ
      </Text>
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
  header: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontWeight: "700", fontSize: 14 },
  badge: {
    fontSize: 11,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    borderRadius: 10,
    color: "#059669",
  },
  text: { fontSize: 12, color: "#6B7280", marginTop: 4 },
});
