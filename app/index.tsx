// app/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const PRIMARY = "#518581";

export default function ParentWelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require("../assets/images/eboard-logo.jpg")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.welcome}>Chào mừng quý phụ huynh</Text>
          <Text style={styles.subtitle}>
            eBoard – Hệ thống quản lý học sinh tiểu học giúp nhà trường, giáo viên và phụ huynh kết nối hiệu quả.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.loginBtn, pressed && styles.pressed]}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.loginText}>Đăng nhập</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>Phiên bản Phụ huynh (Mobile)</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 80,
    marginBottom: 22,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 26,
  },
  loginBtn: {
    width: "70%",
    minWidth: 180,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  footer: {
    position: "absolute",
    bottom: 18,
    fontSize: 12,
    color: "#9CA3AF",
  },
});
