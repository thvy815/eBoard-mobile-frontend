import logo from "@/assets/images/eboard-logo.jpg";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { authService } from "@/services/authService";
import { authSession } from "@/services/authSession";
import { parentService } from "@/services/parentService";

const PRIMARY = "#518581";

export default function ParentLoginScreen() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return phone.trim().length > 0 && password.trim().length > 0;
  }, [phone, password]);

  async function onLogin() {
  if (!canSubmit || loading) return;

  try {
    setLoading(true);

    const res = await authService.parentLogin({
      phoneNumber: phone.trim(),
      password: password,
    });

    console.log("Login success:", res);

    // ✅ đảm bảo token luôn là string
    const accessToken = res?.accessToken;
    const refreshToken = res?.refreshToken;

    if (!accessToken || !refreshToken) {
      Alert.alert(
        "Đăng nhập thất bại",
        "BE không trả accessToken/refreshToken. Kiểm tra lại response login."
      );
      return;
    }

    const parentId = await authSession.saveLoginSession({
      accessToken,
      refreshToken,
      // parentId: res?.parentId, // nếu BE có
    });

    if (!parentId) {
      Alert.alert(
        "Thiếu thông tin tài khoản",
        "Không lấy được parentId từ token. Hãy kiểm tra JWT claims hoặc cập nhật BE để trả parentId."
      );
      return;
    }

    await parentService.fetchAndStoreCurrentChildIds(parentId);

    router.replace("../(drawer)/class");
  } catch (error: any) {
    console.log("Login error:", error);

    Alert.alert(
      "Đăng nhập thất bại",
      error?.response?.data?.message ||
        error?.message ||
        "Vui lòng kiểm tra lại số điện thoại hoặc mật khẩu"
    );
  } finally {
    setLoading(false);
  }
}


  return (
    <SafeAreaView style={styles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.card}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />

            <Text style={styles.title}>Đăng nhập</Text>
            <Text style={styles.subtitle}>Sử dụng số điện thoại và mật khẩu</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Nhập số điện thoại"
                placeholderTextColor="#55637b"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                returnKeyType="next"
              />

              <Text style={[styles.label, { marginTop: 14 }]}>Mật khẩu</Text>
              <View style={styles.passwordWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={secure}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[styles.input, styles.passwordInput]}
                  returnKeyType="done"
                  onSubmitEditing={() => canSubmit && onLogin()}
                />
                <Pressable onPress={() => setSecure((s) => !s)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{secure ? "Hiện" : "Ẩn"}</Text>
                </Pressable>
              </View>

              <Pressable onPress={() => router.push("/(auth)/forgot-password")} style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </Pressable>

              <Pressable
                onPress={onLogin}
                disabled={!canSubmit || loading}
                style={({ pressed }) => [
                  styles.loginBtn,
                  (!canSubmit || loading) && styles.loginBtnDisabled,
                  pressed && canSubmit && !loading && styles.pressed,
                ]}
              >
                <Text style={styles.loginText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
              </Pressable>

              <Pressable onPress={() => router.back()} style={styles.backBtn}>
                <Text style={styles.backText}>Quay lại</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  card: { width: "100%", maxWidth: 420, alignItems: "center" },
  logo: { width: 220, height: 80, marginBottom: 18 },

  title: { fontSize: 22, fontWeight: "800", color: "#111827" },
  subtitle: { marginTop: 6, fontSize: 13, color: "#6B7280" },

  form: { width: "100%", marginTop: 22 },
  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#fff",
  },

  passwordWrap: { position: "relative" },
  passwordInput: { paddingRight: 64 },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  eyeText: { color: PRIMARY, fontWeight: "700", fontSize: 13 },

  loginBtn: {
    marginTop: 18,
    width: "100%",
    borderRadius: 24,
    paddingVertical: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnDisabled: { opacity: 0.5 },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },

  backBtn: { marginTop: 14, alignSelf: "center" },
  backText: { color: "#6B7280", fontSize: 13, fontWeight: "600" },

  forgotBtn: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  forgotText: {
    color: PRIMARY,
    fontWeight: "700",
    fontSize: 13,
  },
});
