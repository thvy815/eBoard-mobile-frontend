import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

const PRIMARY = "#518581";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.sub}>Nhập số điện thoại để nhận hướng dẫn đặt lại mật khẩu.</Text>

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />

        <Pressable
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}
          onPress={() => {
            // TODO: nối API gửi OTP/ reset link sau
            console.log("Forgot password phone:", phone);
            router.back();
          }}
        >
          <Text style={styles.btnText}>Gửi</Text>
        </Pressable>

        <Pressable onPress={() => router.back()} style={{ marginTop: 14 }}>
          <Text style={{ color: "#6B7280", fontWeight: "700" }}>Quay lại</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "800", color: "#111827" },
  sub: { marginTop: 8, color: "#6B7280", lineHeight: 20, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  btn: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
