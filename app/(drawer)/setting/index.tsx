import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PRIMARY = "#4f9a94";

/**
 * ✅ Định nghĩa route dạng literal
 * để phù hợp typed routes của expo-router
 */
type SettingRoute =
  | "/(drawer)/setting/profile"
  | "/(drawer)/setting/student"
  | "/(drawer)/setting/notifications"
  | "/(drawer)/setting/security"
  | "/(drawer)/setting/help";

type Item = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: SettingRoute;
  danger?: boolean;
};

const ACCOUNT_ITEMS: Item[] = [
  {
    title: "Thông tin cá nhân",
    icon: "person-outline",
    route: "/(drawer)/setting/profile",
  },
  {
    title: "Thông tin học sinh",
    icon: "school-outline",
    route: "/(drawer)/setting/student",
  },
  {
    title: "Thông báo",
    icon: "notifications-outline",
    route: "/(drawer)/setting/notifications",
  },
  {
    title: "Bảo mật",
    icon: "lock-closed-outline",
    route: "/(drawer)/setting/security",
  },
];

const SUPPORT_ITEMS: Item[] = [
  {
    title: "Trợ giúp",
    icon: "help-circle-outline",
    route: "/(drawer)/setting/help",
  },
];

export default function SettingScreen() {
  function onLogout() {
    // TODO: clear token / session sau
    router.replace("/");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 18 }}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>Cài đặt</Text>
        <Text style={styles.subtitle}>Quản lý tài khoản và ứng dụng</Text>
      </View>

      <Text style={styles.sectionLabel}>Tài khoản</Text>
      <View style={styles.group}>
        {ACCOUNT_ITEMS.map((item) => (
          <RowItem key={item.title} item={item} />
        ))}
      </View>

      <Text style={styles.sectionLabel}>Hỗ trợ</Text>
      <View style={styles.group}>
        {SUPPORT_ITEMS.map((item) => (
          <RowItem key={item.title} item={item} />
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Phiên bản 1.0.0</Text>
    </ScrollView>
  );
}

function RowItem({ item }: { item: Item }) {
  return (
    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.85}
      onPress={() => item.route && router.push(item.route)}
    >
      <View style={styles.itemLeft}>
        <View style={styles.iconWrap}>
          <Ionicons name={item.icon} size={18} color={PRIMARY} />
        </View>
        <Text style={styles.itemText}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 16,
  },

  headerBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  sectionLabel: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "800",
  },
  group: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    overflow: "hidden",
  },

  item: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EAF5F4",
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#111827",
  },

  logoutBtn: {
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "900",
    fontSize: 14.5,
  },

  version: {
    marginTop: 10,
    textAlign: "center",
    color: "#9CA3AF",
    fontWeight: "700",
    fontSize: 12,
  },
});
