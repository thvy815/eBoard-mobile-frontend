import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { authSession } from "@/services/authSession";
import { parentService } from "@/services/parentService";
import { teacherService } from "@/services/teacherService";
import type { ParentChildItem } from "@/types/parent";

const PRIMARY = "#4f9a94";

const MENU = [
  { title: "Điểm danh", icon: "clipboard-outline", route: "/class/attendance" as const },
  { title: "Quỹ lớp", icon: "wallet-outline", route: "/class/fund" as const },
  { title: "Kết quả học tập", icon: "book-outline", route: "/class/study-result" as const },
  { title: "Lịch thi", icon: "calendar-outline", route: "/class/exam" as const },
  { title: "Thời khóa biểu", icon: "time-outline", route: "/class/timetable" as const },
];

type ClassInfoUI = {
  classId: string;
  studentId: string;
  className: string;
  teacherName: string;
  teacherPhone?: string;
  teacherEmail?: string;
  totalStudents: number;
  room: string;
};

export default function ClassDashboard() {
  const [loading, setLoading] = useState(true);
  const [classInfo, setClassInfo] = useState<ClassInfoUI | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const parentId = await authSession.getParentId();
        if (!parentId) throw new Error("Missing parentId (chưa đăng nhập hoặc chưa lưu session)");

        // 1) Gọi API lấy danh sách con + class
        const list: ParentChildItem[] = await parentService.getChildrenByParentId(parentId, 1, 20);
        if (!list || list.length === 0) throw new Error("Phụ huynh chưa có học sinh");

        // Mặc định lấy đứa con đầu tiên
        const first = list[0];

        // Lưu classId + studentId để dùng cho các màn sau
        await parentService.fetchAndStoreCurrentChildIds(parentId);

        // 2) Gọi API lấy teacher theo classId để có email + phone
        const classId = first.classInfo.id;

        let teacherPhone: string | undefined = undefined;
        let teacherEmail: string | undefined = undefined;

        try {
          const t = await teacherService.getTeacherByClassId(classId);
          teacherPhone = t?.phoneNumber ?? undefined;
          teacherEmail = t?.email ?? undefined;
        } catch {
          // teacher api fail thì vẫn show teacherName bình thường
        }

        const ui: ClassInfoUI = {
          classId: first.classInfo.id,
          studentId: first.studentInfo.id,
          className: first.classInfo.name,
          teacherName: first.classInfo.teacherName,
          totalStudents: first.classInfo.currentStudentCount,
          room: first.classInfo.roomName,
          teacherPhone,
          teacherEmail,
        };

        if (mounted) setClassInfo(ui);
      } catch (e: any) {
        if (mounted) {
          setError(e?.message ?? "Load class info failed");
          setClassInfo(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const teacherPhoneText = classInfo?.teacherPhone ?? "—";
  const teacherEmailText = classInfo?.teacherEmail ?? "—";

  const disableContact = useMemo(() => {
    return !classInfo?.teacherPhone && !classInfo?.teacherEmail;
  }, [classInfo?.teacherPhone, classInfo?.teacherEmail]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 18 }}>
      <Text style={styles.header}>Xin chào, Phụ huynh!</Text>
      <Text style={styles.sub}>Theo dõi học tập của con em</Text>

      {/* MENU */}
      {MENU.map((item) => (
        <TouchableOpacity
          key={item.title}
          style={styles.card}
          onPress={() => router.push(item.route)}
          activeOpacity={0.85}
        >
          <Ionicons name={item.icon as any} size={26} color={PRIMARY} />
          <Text style={styles.cardText}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      ))}

      {/* CLASS INFO */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin lớp học</Text>

        {/* trạng thái load/error */}
        {loading && <Text style={{ color: "#6B7280", marginBottom: 8 }}>Đang tải thông tin lớp...</Text>}
        {!!error && <Text style={{ color: "#DC2626", marginBottom: 8 }}>{error}</Text>}

        {/* Teacher card */}
        <View style={styles.teacherCard}>
          <View style={styles.teacherHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={18} color={PRIMARY} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.teacherRole}>Giáo viên chủ nhiệm</Text>
              <Text style={styles.teacherName}>{classInfo?.teacherName ?? "—"}</Text>
              <Text style={styles.className}>{classInfo?.className ?? "—"}</Text>
            </View>
          </View>

          <View style={styles.teacherRow}>
            <View style={styles.teacherItem}>
              <Ionicons name="call-outline" size={16} color={PRIMARY} />
              <Text style={styles.teacherValue}>{teacherPhoneText}</Text>
            </View>
            <View style={styles.teacherItem}>
              <Ionicons name="mail-outline" size={16} color={PRIMARY} />
              <Text style={styles.teacherValue}>{teacherEmailText}</Text>
            </View>
          </View>

          <View style={styles.teacherActions}>
            <TouchableOpacity
              style={[styles.actionBtn, disableContact && { opacity: 0.5 }]}
              activeOpacity={0.85}
              disabled={disableContact}
              onPress={() => {
                // TODO: Linking.openURL(`tel:${classInfo?.teacherPhone}`)
              }}
            >
              <Ionicons name="call-outline" size={16} color={PRIMARY} />
              <Text style={styles.actionText}>Gọi điện</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnAlt, disableContact && { opacity: 0.5 }]}
              activeOpacity={0.85}
              disabled={disableContact}
              onPress={() => {
                // TODO: Linking.openURL(`mailto:${classInfo?.teacherEmail}`)
              }}
            >
              <Ionicons name="mail-outline" size={16} color="#F59E0B" />
              <Text style={[styles.actionText, { color: "#F59E0B" }]}>Gửi email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="people-outline" size={18} color={PRIMARY} />
            <Text style={styles.statLabel}>Tổng số học sinh</Text>
            <Text style={styles.statValue}>{classInfo ? `${classInfo.totalStudents} học sinh` : "—"}</Text>
          </View>

          <View style={[styles.statBox, styles.statBoxAlt]}>
            <Ionicons name="location-outline" size={18} color="#F59E0B" />
            <Text style={styles.statLabel}>Phòng học</Text>
            <Text style={styles.statValue}>{classInfo?.room ?? "—"}</Text>
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>
            <Ionicons name="information-circle-outline" size={16} color={PRIMARY} /> Liên hệ với giáo viên:
          </Text>
          <Text style={styles.noteText}>• Vui lòng liên hệ trong giờ hành chính (7:00 - 17:00)</Text>
          <Text style={styles.noteText}>• Trường hợp khẩn cấp có thể gọi điện bất cứ lúc nào</Text>
          <Text style={styles.noteText}>• Email phản hồi trong vòng 24 giờ làm việc</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f4f6f8" },
  header: { fontSize: 22, fontWeight: "800", marginBottom: 4, color: "#111827" },
  sub: { color: "#6B7280", marginBottom: 16 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  cardText: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: "600", color: "#111827" },

  section: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827", marginBottom: 10 },

  teacherCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  teacherHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAF5F4",
    alignItems: "center",
    justifyContent: "center",
  },
  teacherRole: { fontSize: 13, color: "#6B7280", fontWeight: "700" },
  teacherName: { fontSize: 16, color: "#111827", fontWeight: "800", marginTop: 2 },
  className: { marginTop: 2, fontSize: 13, color: "#6B7280", fontWeight: "600" },

  teacherRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  teacherItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },
  teacherValue: { color: "#111827", fontWeight: "700", fontSize: 13 },

  teacherActions: { flexDirection: "row", gap: 12, marginTop: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#BFE4E1",
    backgroundColor: "#fff",
  },
  actionBtnAlt: { borderColor: "#FCD9A8" },
  actionText: { fontWeight: "800", color: PRIMARY, fontSize: 14 },

  statsRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFE4E1",
  },
  statBoxAlt: { borderColor: "#FCD9A8" },
  statLabel: { marginTop: 6, fontSize: 12, color: "#6B7280", fontWeight: "700" },
  statValue: { marginTop: 4, fontSize: 14, color: "#111827", fontWeight: "800" },

  noteBox: {
    marginTop: 12,
    backgroundColor: "#EAF5F4",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFE4E1",
  },
  noteTitle: { fontSize: 13, fontWeight: "800", color: "#0F766E", marginBottom: 6 },
  noteText: { fontSize: 12.5, color: "#0F766E", lineHeight: 18 },
});
