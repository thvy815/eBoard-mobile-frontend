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
import { studentService } from "@/services/studentService";

const PRIMARY = "#4f9a94";

type ChildItem = {
  studentInfo: {
    id: string;
    firstName?: string;
    lastName?: string;
    relationshipWithParent?: string;
    dateOfBirth?: string; // yyyy-mm-dd
    gender?: string;

    // có thể có hoặc không tuỳ API bạn
    address?: string;
    province?: string;
    district?: string;
    ward?: string;
    fullAddress?: string;
  };
  classInfo?: {
    name?: string;
  };
};

function toDisplayDob(iso?: string) {
  // yyyy-mm-dd -> dd/mm/yyyy
  if (!iso || iso.length < 10) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

function toIsoDob(display: string) {
  // dd/mm/yyyy -> yyyy-mm-dd
  const s = (display ?? "").trim();
  const parts = s.split("/");
  if (parts.length !== 3) return "";
  const [d, m, y] = parts.map((x) => x.trim());
  if (!d || !m || !y) return "";
  // không validate sâu, backend tự validate thêm
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function buildFullName(firstName?: string, lastName?: string) {
  const ln = (lastName ?? "").trim();
  const fn = (firstName ?? "").trim();
  return `${ln} ${fn}`.trim();
}

function splitVietnameseName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const firstName = parts[parts.length - 1];
  const lastName = parts.slice(0, -1).join(" ");
  return { firstName, lastName };
}

export default function StudentInfoScreen() {
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI fields
  const [studentId, setStudentId] = useState<string>("");
  const [studentName, setStudentName] = useState("");
  const [dob, setDob] = useState(""); // dd/mm/yyyy (UI)
  const [gender, setGender] = useState("");
  const [className, setClassName] = useState("");

  // giữ bản gốc để PATCH giữ nguyên các field không có trong UI
  const originalRef = useRef({
    firstName: "",
    lastName: "",
    relationshipWithParent: "",
    dateOfBirthIso: "",

    gender: "",

    address: "",
    province: "",
    district: "",
    ward: "",
  });

  useEffect(() => {
    let mounted = true;

    async function loadStudent() {
      try {
        setLoading(true);
        setError(null);

        const parentId = await authSession.getParentId();
        if (!parentId) {
          if (mounted) setError("Không tìm thấy ParentId trong session.");
          return;
        }

        const children: ChildItem[] = await parentService.getChildrenByParentId(parentId, 1, 20);
        const first = children?.[0];
        if (!first?.studentInfo?.id) {
          if (mounted) setError("Không tìm thấy học sinh nào cho phụ huynh này.");
          return;
        }

        const si = first.studentInfo;

        // map UI
        const full = buildFullName(si.firstName, si.lastName);
        const dobDisplay = toDisplayDob(si.dateOfBirth);
        const clsName = first.classInfo?.name ?? "";

        if (!mounted) return;

        setStudentId(si.id);
        setStudentName(full);
        setDob(dobDisplay);
        setGender(si.gender ?? "");
        setClassName(clsName);

        // store original for PATCH
        originalRef.current = {
          firstName: si.firstName ?? "",
          lastName: si.lastName ?? "",
          relationshipWithParent: si.relationshipWithParent ?? "",
          dateOfBirthIso: (si.dateOfBirth ?? "").slice(0, 10),

          gender: si.gender ?? "",

          address: si.address ?? si.fullAddress ?? "",
          province: si.province ?? "",
          district: si.district ?? "",
          ward: si.ward ?? "",
        };
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Load học sinh thất bại.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStudent();
    return () => {
      mounted = false;
    };
  }, []);

  const canSave = useMemo(() => {
    if (saving) return false;
    if (!studentId) return false;
    if (!studentName.trim()) return false;
    // dob có thể để trống nếu bạn muốn bắt buộc thì check thêm
    return true;
  }, [studentId, studentName, saving]);

  function onToggleEdit() {
    if (isEditing) {
      // revert về bản gốc
      const o = originalRef.current;
      setStudentName(buildFullName(o.firstName, o.lastName));
      setDob(toDisplayDob(o.dateOfBirthIso));
      setGender(o.gender);
      setIsEditing(false);
      return;
    }
    setIsEditing(true);
  }

  async function onSave() {
    try {
      if (!studentId) return;

      setSaving(true);

      const o = originalRef.current;

      // name => firstName/lastName
      const { firstName, lastName } = splitVietnameseName(studentName);

      // dob UI => iso, nếu user không sửa/để trống thì giữ nguyên
      const isoFromUi = dob.trim() ? toIsoDob(dob) : "";
      const dateOfBirth = isoFromUi || o.dateOfBirthIso;

      // gender: nếu trống thì giữ nguyên
      const nextGender = gender.trim() || o.gender;

      await studentService.patchStudent(studentId, {
        firstName: firstName || o.firstName,
        lastName: lastName || o.lastName,

        relationshipWithParent: o.relationshipWithParent, // ✅ giữ nguyên
        dateOfBirth: dateOfBirth, // ✅ dùng UI nếu có, không thì giữ nguyên
        gender: nextGender, // ✅ dùng UI nếu có, không thì giữ nguyên

        // ✅ giữ nguyên các field không có trong UI
        address: o.address,
        province: o.province,
        district: o.district,
        ward: o.ward,
      });

      // update original theo state mới (để lần sau edit/revert đúng)
      originalRef.current = {
        ...o,
        firstName: firstName || o.firstName,
        lastName: lastName || o.lastName,
        dateOfBirthIso: dateOfBirth,
        gender: nextGender,
      };

      setIsEditing(false);
      Alert.alert("Thành công", "Đã lưu thông tin học sinh.");
    } catch (e: any) {
      Alert.alert("Lỗi", e?.message ?? "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
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
              onPress={onToggleEdit}
              style={styles.editBtn}
              activeOpacity={0.85}
              disabled={loading || saving}
            >
              <Ionicons name="create-outline" size={16} color={PRIMARY} />
            </TouchableOpacity>
          </View>

          <View style={styles.avatar}>
            <Ionicons name="happy-outline" size={24} color="#fff" />
          </View>

          {loading ? (
            <View style={{ marginTop: 10, alignItems: "center" }}>
              <ActivityIndicator />
              <Text style={{ marginTop: 8, color: "#6B7280", fontWeight: "700" }}>
                Đang tải dữ liệu...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <>
              <Field
                label="Họ và tên"
                value={studentName}
                setValue={setStudentName}
                editable={isEditing}
              />

              {/* UI đang là string ngày sinh dd/mm/yyyy */}
              <Field label="Ngày sinh" value={dob} setValue={setDob} editable={isEditing} />

              <Field label="Giới tính" value={gender} setValue={setGender} editable={isEditing} />

              <Field label="Lớp học" value={className} setValue={setClassName} editable={false} />

              <View style={styles.noteBox}>
                <Text style={styles.noteTitle}>
                  <Ionicons name="information-circle-outline" size={16} color={PRIMARY} /> Thông tin:
                </Text>
                <Text style={styles.noteText}>• Lớp học do nhà trường quản lý</Text>
                <Text style={styles.noteText}>• Chỉ chỉnh sửa: Họ tên / Ngày sinh / Giới tính</Text>
                <Text style={styles.noteText}>• Thay đổi sẽ được cập nhật lên hệ thống</Text>
              </View>

              {isEditing && (
                <TouchableOpacity
                  style={[styles.saveBtn, !canSave && { opacity: 0.5 }]}
                  onPress={onSave}
                  disabled={!canSave}
                  activeOpacity={0.85}
                >
                  {saving ? <ActivityIndicator /> : <Text style={styles.saveText}>Lưu thay đổi</Text>}
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
