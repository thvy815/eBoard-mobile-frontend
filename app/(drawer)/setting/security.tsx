import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const PRIMARY = "#4f9a94";

export default function SecurityScreen() {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const canSubmit = useMemo(
    () => next.length >= 6 && next === confirm && cur.length > 0,
    [cur, next, confirm]
  );

  function onChangePassword() {
    // TODO: call API change password
    console.log("change password");
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Bảo mật",
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

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 18 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Đổi mật khẩu</Text>

          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            value={cur}
            onChangeText={setCur}
            secureTextEntry
            style={styles.input}
            placeholder="Nhập mật khẩu hiện tại"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            value={next}
            onChangeText={setNext}
            secureTextEntry
            style={styles.input}
            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            style={styles.input}
            placeholder="Nhập lại mật khẩu mới"
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.noteBox}>
            <Text style={styles.note}>• Mật khẩu phải có ít nhất 6 ký tự</Text>
            <Text style={styles.note}>• Nên sử dụng ký tự chữ + số + ký tự đặc biệt</Text>
            <Text style={styles.note}>• Không chia sẻ mật khẩu với người khác</Text>
          </View>

          <TouchableOpacity
            style={[styles.btn, !canSubmit && { opacity: 0.5 }]}
            disabled={!canSubmit}
            onPress={onChangePassword}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  title: { fontSize: 16, fontWeight: "900", color: "#111827", marginBottom: 10 },
  label: { marginTop: 10, fontSize: 12, color: "#6B7280", fontWeight: "800", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },
  noteBox: {
    marginTop: 12,
    backgroundColor: "#FFF7ED",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  note: { color: "#9A3412", fontWeight: "700", fontSize: 12.5, lineHeight: 18 },
  btn: { marginTop: 14, backgroundColor: PRIMARY, paddingVertical: 12, borderRadius: 24, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 14.5 },
});
