import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const PRIMARY = "#4f9a94";

export default function ParentProfileScreen() {
  // TODO: Replace with API data later
  const [isEditing, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState("Trần Văn Minh");
  const [relationship, setRelationship] = useState("Bố");
  const [phone, setPhone] = useState("0912345678");
  const [email, setEmail] = useState("tranvanminh@email.com");
  const [address, setAddress] = useState("123 Đường Lê Lợi, Quận 1, TP.HCM");

  const canSave = useMemo(
    () => fullName.trim().length > 0 && phone.trim().length > 0,
    [fullName, phone]
  );

  function onSave() {
    // TODO: call API update parent profile
    // await parentService.updateProfile({ fullName, relationship, phone, email, address });
    setIsEditing(false);
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
              onPress={() => setIsEditing((s) => !s)}
              style={styles.editBtn}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={16} color={PRIMARY} />
            </TouchableOpacity>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color="#fff" />
          </View>

          <Field label="Họ và tên" value={fullName} setValue={setFullName} editable={isEditing} />
          <Field
            label="Mối quan hệ"
            value={relationship}
            setValue={setRelationship}
            editable={isEditing}
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
              <Text style={styles.saveText}>Lưu thay đổi</Text>
            </TouchableOpacity>
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
});
