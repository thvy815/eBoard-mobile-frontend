import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HelpScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Trợ giúp",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Ionicons
              name="chevron-back"
              size={24}
              color="#111827"
              style={{ marginLeft: 8 }}
              onPress={() => router.replace("/(drawer)/setting")}
            />
          ),
        }}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Trung tâm Trợ giúp</Text>

        <Text style={styles.section}>
          <Text style={styles.bold}>1. Quản lý thông tin</Text>
          {"\n"}Phụ huynh có thể xem và cập nhật thông tin cá nhân, thay đổi mật khẩu,
          cũng như theo dõi thông tin học sinh được liên kết với tài khoản.
        </Text>

        <Text style={styles.section}>
          <Text style={styles.bold}>2. Chỉnh sửa thông tin học sinh</Text>
          {"\n"}Một số thông tin của học sinh (như họ tên, ngày sinh, giới tính)
          có thể được chỉnh sửa tùy theo quy định của nhà trường.
          Những thay đổi sẽ được hệ thống ghi nhận.
        </Text>

        <Text style={styles.section}>
          <Text style={styles.bold}>3. Bảo mật tài khoản</Text>
          {"\n"}Để đảm bảo an toàn, phụ huynh nên thường xuyên thay đổi mật khẩu
          và không chia sẻ thông tin đăng nhập cho người khác.
        </Text>

        <Text style={styles.section}>
          <Text style={styles.bold}>4. Cần hỗ trợ thêm?</Text>
          {"\n"}Nếu gặp khó khăn trong quá trình sử dụng,
          vui lòng liên hệ với nhà trường hoặc bộ phận hỗ trợ kỹ thuật
          để được hướng dẫn chi tiết.
        </Text>

        <Text style={styles.footer}>
          Cảm ơn quý phụ huynh đã đồng hành cùng nhà trường 💙
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    fontSize: 14.5,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 14,
    fontWeight: "500",
  },
  bold: {
    fontWeight: "800",
    color: "#111827",
  },
  footer: {
    marginTop: 20,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    fontStyle: "italic",
  },
});
