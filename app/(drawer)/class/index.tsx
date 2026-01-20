import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MENU = [
  { title: "Điểm danh", icon: "clipboard-outline", route: "/class/attendance" as const },
  { title: "Quỹ lớp", icon: "wallet-outline", route: "/class/fund" as const },
  { title: "Kết quả học tập", icon: "book-outline", route: "/class/study-result" as const },
  { title: "Lịch thi", icon: "calendar-outline", route: "/class/exam" as const },
  { title: "Thời khóa biểu", icon: "time-outline", route: "/class/timetable" as const },
];

export default function ClassDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Xin chào, Phụ huynh!</Text>
      <Text style={styles.sub}>Theo dõi học tập của con em</Text>

      {MENU.map((item) => (
        <TouchableOpacity
          key={item.title}
          style={styles.card}
          onPress={() => router.push(item.route)}
        >
          <Ionicons name={item.icon as any} size={28} color="#4f9a94" />
          <Text style={styles.cardText}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f6f8" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  sub: { color: "#666", marginBottom: 16 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
  },
});
