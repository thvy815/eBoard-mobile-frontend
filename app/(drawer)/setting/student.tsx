import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const PRIMARY = "#4f9a94";

export default function StudentInfoScreen() {
  // TODO: Replace with API data later
  const [isEditing, setIsEditing] = useState(false);

  // ✅ BỎ MÃ HỌC SINH
  const [studentName, setStudentName] = useState("Trần Minh Anh");
  const [dob, setDob] = useState("15/05/2014");
  const [gender, setGender] = useState("Nữ");
  const [className, setClassName] = useState("Lớp 5A");

  const canSave = useMemo(() => studentName.trim().length > 0, [studentName]);

  function onSave() {
    // TODO: call API update student info (if allowed)
    // await studentService.updateStudent(...)
    setIsEditing(false);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Thông tin học sinh",
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
            <Text style={styles.title}>Thông tin học sinh</Text>

            <TouchableOpacity
              onPress={() => setIsEditing((s) => !s)}
              style={styles.editBtn}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={16} color={PRIMARY} />
            </TouchableOpacity>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="happy-outline" size={24} color="#fff" />
          </View>

          <Field label="Họ và tên" value={studentName} setValue={setStudentName} editable={isEditing} />
          <Field label="Ngày sinh" value={dob} setValue={setDob} editable={isEditing} />
          <Field label="Giới tính" value={gender} setValue={setGender} editable={isEditing} />
          <Field label="Lớp học" value={className} setValue={setClassName} editable={false} />

          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>
              <Ionicons name="information-circle-outline" size={16} color={PRIMARY} /> Thông tin:
            </Text>
            <Text style={styles.noteText}>• Lớp học do nhà trường quản lý</Text>
            <Text style={styles.noteText}>• Các thông tin khác có thể chỉnh sửa (tùy chính sách)</Text>
            <Text style={styles.noteText}>• Thay đổi sẽ được gửi đến nhà trường để xác nhận</Text>
          </View>

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
}) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.setValue}
        editable={props.editable}
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

  noteBox: {
    marginTop: 14,
    backgroundColor: "#EAF5F4",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFE4E1",
  },
  noteTitle: { fontSize: 13, fontWeight: "900", color: "#0F766E", marginBottom: 6 },
  noteText: { fontSize: 12.5, color: "#0F766E", lineHeight: 18 },

  saveBtn: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "900", fontSize: 14.5 },
});
