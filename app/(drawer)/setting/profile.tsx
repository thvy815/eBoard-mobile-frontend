import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { authSession } from "@/services/authSession";
import { parentService } from "@/services/parentService";

const PRIMARY = "#4f9a94";

export default function ParentProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [parentId, setParentId] = useState<string>("");

  // fields
  const [fullName, setFullName] = useState("");
  const [relationship, setRelationship] = useState(""); // từ api children (không update)
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // giữ bản gốc để cancel (nếu muốn)
  const originalRef = useRef({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    relationship: "",
  });

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setFetchError(null);

        const pid = await authSession.getParentId();
        if (!pid) {
          if (mounted) setFetchError("Không tìm thấy ParentId trong session.");
          return;
        }
        if (mounted) setParentId(pid);

        const [info, children] = await Promise.all([
          parentService.getParentInfo(pid),
          parentService.getChildrenByParentId(pid, 1, 20),
        ]);

        if (!mounted) return;

        const rel = children?.[0]?.studentInfo?.relationshipWithParent ?? "";

        const next = {
          fullName: info?.fullName ?? "",
          phone: info?.phoneNumber ?? "",
          email: info?.email ?? "",
          address: info?.address ?? "",
          relationship: rel,
        };

        setFullName(next.fullName);
        setPhone(next.phone);
        setEmail(next.email);
        setAddress(next.address);
        setRelationship(next.relationship);

        originalRef.current = next;
      } catch (e: any) {
        if (!mounted) return;
        setFetchError(e?.message ?? "Không tải được thông tin phụ huynh.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const canSave = useMemo(() => {
    if (!fullName.trim() || !phone.trim()) return false;
    if (saving) return false;
    return true;
  }, [fullName, phone, saving]);

  async function onSave() {
    if (!parentId) return;

    try {
      setSaving(true);

      await parentService.updateParentInfo(parentId, {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phone.trim(),
        address: address.trim(),
        healthCondition: "", // nếu bạn có field này trên UI thì set từ state
      });

      // sau khi save xong: reload info mới (optional) hoặc set original = state hiện tại
      originalRef.current = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        relationship,
      };

      setIsEditing(false);
      Alert.alert("Thành công", "Đã lưu thông tin phụ huynh.");
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  function onToggleEdit() {
    // nếu đang edit -> bấm lại để thoát edit và revert về bản gốc (đỡ bị nhập bậy)
    if (isEditing) {
      const o = originalRef.current;
      setFullName(o.fullName);
      setPhone(o.phone);
      setEmail(o.email);
      setAddress(o.address);
      setRelationship(o.relationship);
      setIsEditing(false);
      return;
    }
    setIsEditing(true);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Thông tin cá nhân",
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
          <View style={styles.topRow}>
            <Text style={styles.title}>Thông tin cá nhân</Text>

            <TouchableOpacity
              onPress={onToggleEdit}
              style={styles.editBtn}
              activeOpacity={0.85}
              disabled={loading || saving}
            >
              <Ionicons name="create-outline" size={16} color={PRIMARY} />
            </TouchableOpacity>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color="#fff" />
          </View>

          {loading ? (
            <View style={{ marginTop: 10, alignItems: "center" }}>
              <ActivityIndicator />
              <Text style={{ marginTop: 8, color: "#6B7280", fontWeight: "700" }}>
                Đang tải dữ liệu...
              </Text>
            </View>
          ) : fetchError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{fetchError}</Text>
            </View>
          ) : (
            <>
              <Field label="Họ và tên" value={fullName} setValue={setFullName} editable={isEditing} />

              {/* Relationship lấy từ children API: cho phép xem, còn update thì không có endpoint */}
              <Field
                label="Mối quan hệ"
                value={relationship}
                setValue={setRelationship}
                editable={false}
              />

              <Field
                label="Số điện thoại"
                value={phone}
                setValue={setPhone}
                editable={isEditing}
                keyboardType="phone-pad"
              />

              <Field
                label="Email"
                value={email}
                setValue={setEmail}
                editable={isEditing}
                keyboardType="email-address"
              />

              <Field label="Địa chỉ" value={address} setValue={setAddress} editable={isEditing} />

              {isEditing && (
                <TouchableOpacity
                  style={[styles.saveBtn, !canSave && { opacity: 0.5 }]}
                  onPress={onSave}
                  disabled={!canSave}
                  activeOpacity={0.85}
                >
                  {saving ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.saveText}>Lưu thay đổi</Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}

function Field(props: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  editable: boolean;
  keyboardType?: "default" | "phone-pad" | "email-address";
}) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.setValue}
        editable={props.editable}
        keyboardType={props.keyboardType ?? "default"}
        style={[styles.input, !props.editable && styles.inputDisabled]}
        placeholderTextColor="#9CA3AF"
      />
    </View>
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
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "900", color: "#111827" },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EAF5F4",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    marginTop: 14,
    marginBottom: 8,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  label: { fontSize: 12, color: "#6B7280", fontWeight: "800", marginBottom: 6 },
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
  inputDisabled: { backgroundColor: "#F9FAFB", color: "#374151" },

  saveBtn: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "900", fontSize: 14.5 },

  errorBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
  },
  errorText: { color: "#B91C1C", fontWeight: "900" },
});
