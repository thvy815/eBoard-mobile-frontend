import { FundExpenseDto } from "@/types/fund";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function FundExpenseItem({
  item,
}: {
  item: FundExpenseDto;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.amount}>
          -{item.amount.toLocaleString()}đ
        </Text>
      </View>

      <Text style={styles.date}>{item.expenseDate}</Text>

      <Text style={styles.text}>
        Người chi: <Text style={styles.bold}>{item.spenderName}</Text>
      </Text>

      {item.notes && (
        <Text style={styles.text}>
          Ghi chú: <Text style={styles.bold}>{item.notes}</Text>
        </Text>
      )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
  },
  amount: {
    color: "#E11D48",
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  text: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  bold: {
    fontWeight: "600",
    color: "#111827",
  },
});
