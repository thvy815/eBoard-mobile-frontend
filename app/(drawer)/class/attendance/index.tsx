import { attendanceService } from "@/services/attendanceService";
import { authSession } from "@/services/authSession";
import { parentService } from "@/services/parentService";
import { AbsentRequestDto } from "@/types/attendance";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";

import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

export default function Attendance() {
  const [requests, setRequests] = useState<AbsentRequestDto[]>([]);
  const [classId, setClassId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  async function fetchNotifications(studentId: string) {
    try {
      const res = await attendanceService.getAbsenceNotifications(studentId);
      setNotifications(res.data || []);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        console.log("No absence notifications (404)");
        setNotifications([]); // coi như không có thông báo
        return;
      }

      console.log("Fetch notifications error", err?.response?.data || err);
    }
  }



  useEffect(() => {
    loadStudentContext();
  }, []);

  async function loadStudentContext() {
  try {
    const parentId = await authSession.getParentId();

    if (!parentId) {
      Alert.alert("Không tìm thấy Parent ID");
      return;
    }

    // Load children từ API
    const children = await parentService.getChildrenByParentId(parentId);

    if (!children || children.length === 0) {
      Alert.alert("Phụ huynh chưa có học sinh");
      return;
    }

    // Lấy studentId đã lưu
    const storedStudentId = await parentService.getStoredStudentId();

    // Match student theo ID (KHÔNG match classId)
    let matched = children.find(
      (c) => c.studentInfo.id === storedStudentId
    );

    // Nếu không match → fallback con đầu tiên
    if (!matched) {
      matched = children[0];
      console.log("Stored student invalid → fallback to first child");
    }

    const studentId = matched.studentInfo.id;
    const classId = matched.classInfo.id;

    const studentName = `${matched.studentInfo.firstName} ${matched.studentInfo.lastName}`;
    const className = matched.classInfo.name;

    console.log("Resolved student:", studentId);
    console.log("Resolved class:", classId);
    fetchNotifications(studentId);
    // Update storage đồng bộ
    await parentService.clearStoredChildIds();
    await parentService.fetchAndStoreCurrentChildIds(parentId);

    setStudentId(studentId);
    setClassId(classId);
    setStudentName(studentName);
    setClassName(className);

    fetchRequests(classId, studentId);

  } catch (err: any) {
    console.log("Load student error", err?.response?.data || err);
    Alert.alert("Không tải được học sinh");
  }
}

  async function fetchRequests(cid: string, sid: string) {
    try {
      setLoading(true);
      const res = await attendanceService.getStudentAbsentRequests(sid, cid);
      setRequests(res.data || []);
    } catch (e) {
      console.log("Fetch request error", e);
    } finally {
      setLoading(false);
    }
  }

  async function reloadRequests() {
    if (!classId || !studentId) return;

    try {
      setRefreshing(true);
      const res = await attendanceService.getStudentAbsentRequests(studentId, classId);
      setRequests(res.data || []);
    } catch (e) {
      console.log("Reload error", e);
    } finally {
      setRefreshing(false);
    }
  }

  async function submitRequest() {
    if (!fromDate || !toDate || !reason || !classId || !studentId) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (fromDate > toDate) {
      Alert.alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
      return;
    }

    try {
  setLoading(true);

  console.log("Submit absent:", {
    studentId,
    classId,
    fromDate: formatDate(fromDate),
    toDate: formatDate(toDate),
  });

  await attendanceService.createAbsentRequest({
    studentId,
    classId,
    fromDate: formatDate(fromDate),
    toDate: formatDate(toDate),
    reason,
  });

  Alert.alert("Gửi đơn thành công");

  setReason("");
  setFromDate(null);
  setToDate(null);
  setOpenModal(false);

  fetchRequests(classId, studentId);

} catch (err: any) {
  console.log("API error submit:", err?.response?.data || err);
  Alert.alert(err?.response?.data?.message || "Gửi đơn thất bại");
}

  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={reloadRequests} />
      }
    >

      {/* HEADER */}
      <View style={styles.studentCard}>
        <Ionicons name="person-circle-outline" size={48} color="#047857" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.studentName}>{studentName || "Học sinh"}</Text>
          <Text style={styles.studentClass}>{className || "Lớp"} • 2024–2025</Text>
        </View>
      </View>

      {/* CREATE BUTTON */}
      <View style={styles.requestCard}>
        <Text style={styles.requestTitle}>Báo vắng có phép</Text>
        <Text style={styles.requestSubtitle}>Gửi đơn xin phép khi con em vắng học</Text>

        <TouchableOpacity onPress={() => setOpenModal(true)} style={styles.submitBtn}>
          <Text style={styles.submitText}>+ Tạo phiếu xin phép</Text>
        </TouchableOpacity>
      </View>

      {/* NOTIFICATION PANEL */}
      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <Ionicons name="notifications-outline" size={18} color="#ec4899" />
          <Text style={styles.notificationTitle}>Thông báo vắng học</Text>
        </View>

        {/* CASE: KHÔNG CÓ THÔNG BÁO */}
        {notifications.length === 0 && (
          <View style={styles.emptyNotification}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#10b981" />
            <Text style={styles.emptyNotificationText}>
              Hiện chưa có thông báo vắng nào
            </Text>
          </View>
        )}

        {/* CASE: CÓ THÔNG BÁO */}
        {notifications.length > 0 && (
          <>
            <Text style={styles.notificationUnread}>
              Bạn có {notifications.filter(n => !n.isRead).length} thông báo chưa đọc
            </Text>

            {notifications.map((n) => (
              <View key={n.id} style={[
                styles.notificationItem,
                !n.isRead && styles.notificationUnreadItem
              ]}>
                <Ionicons name="alert-circle" size={16} color="#ec4899" />

                <View style={{ flex: 1 }}>
                  <Text style={styles.notificationText}>{n.message}</Text>
                  <Text style={styles.notificationDate}>{n.date}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
            </TouchableOpacity>
          </>
        )}
      </View>



      {/* LIST */}
      <View style={styles.listCard}>
        <Text style={styles.listTitle}>Danh sách đơn ({requests.length})</Text>

        {requests.map((req) => (
          <View key={req.id} style={styles.requestItem}>
            <View style={styles.requestRow}>
              <Ionicons name="calendar-outline" size={16} color="#047857" />
              <Text style={styles.dateText}>
                {req.fromDate} → {req.toDate}
              </Text>
            </View>

            <Text style={styles.reasonText}>Lý do: {req.reason}</Text>
          </View>
        ))}
      </View>

      {/* MODAL */}
      <Modal visible={openModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Phiếu báo vắng</Text>
              <TouchableOpacity onPress={() => setOpenModal(false)}>
                <Ionicons name="close" size={22} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Lớp</Text>
            <View style={styles.readonlyInput}>
              <Text>{className || "Chưa có lớp"}</Text>
            </View>

            {/* FROM DATE */}
            <Text style={styles.modalLabel}>Từ ngày</Text>
            <TouchableOpacity style={styles.dateBox} onPress={() => setShowFromPicker(true)}>
              <Ionicons name="calendar-outline" size={16} color="#047857" />
              <Text>{fromDate ? formatDate(fromDate) : "Chọn ngày"}</Text>
            </TouchableOpacity>

            {showFromPicker && (
              <DateTimePicker
                value={fromDate || new Date()}
                mode="date"
                onChange={(e, date) => {
                  setShowFromPicker(false);
                  if (date) setFromDate(date);
                }}
              />
            )}

            {/* TO DATE */}
            <Text style={styles.modalLabel}>Đến ngày</Text>
            <TouchableOpacity style={styles.dateBox} onPress={() => setShowToPicker(true)}>
              <Ionicons name="calendar-outline" size={16} color="#047857" />
              <Text>{toDate ? formatDate(toDate) : "Chọn ngày"}</Text>
            </TouchableOpacity>

            {showToPicker && (
              <DateTimePicker
                value={toDate || new Date()}
                mode="date"
                onChange={(e, date) => {
                  setShowToPicker(false);
                  if (date) setToDate(date);
                }}
              />
            )}

            {/* REASON */}
            <Text style={styles.modalLabel}>Lý do</Text>
            <TextInput
              placeholder="Nhập lý do..."
              value={reason}
              onChangeText={setReason}
              multiline
              style={[styles.input, { height: 90 }]}
            />

            {/* ACTIONS */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setOpenModal(false)}>
                <Text>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={submitRequest}>
                <Text style={styles.submitText}>Gửi</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

/* STATUS LABEL */
const statusLabel = (status: string) => {
  switch (status) {
    case "APPROVED": return "Đã duyệt";
    case "PENDING": return "Chờ duyệt";
    case "REJECTED": return "Từ chối";
    default: return "Không rõ";
  }
};

/* STATUS COLOR */
const statusStyle = (status: string): ViewStyle => {
  switch (status) {
    case "APPROVED": return { backgroundColor: "#10b981" };
    case "PENDING": return { backgroundColor: "#f59e0b" };
    case "REJECTED": return { backgroundColor: "#ef4444" };
    default: return { backgroundColor: "#9CA3AF" };
  }
};

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 16,
  },

  dateBox: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 10,
  padding: 10,
  marginBottom: 10,
  backgroundColor: "#F9FAFB",
},

dateTextPicker: {
  fontSize: 14,
  color: "#374151",
},

emptyNotification: {
  alignItems: "center",
  paddingVertical: 14,
  gap: 6,
},

emptyNotificationText: {
  fontSize: 13,
  color: "#6B7280",
},

notificationCard: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 14,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "#FBCFE8",
},

notificationHeader: {
  marginBottom: 10,
},

notificationTitle: {
  fontSize: 15,
  fontWeight: "700",
  color: "#BE185D",
},

notificationUnread: {
  fontSize: 12,
  color: "#6B7280",
  marginTop: 2,
},

notificationItem: {
  flexDirection: "row",
  gap: 10,
  padding: 10,
  borderRadius: 12,
  backgroundColor: "#F9FAFB",
  marginBottom: 8,
},

notificationUnreadItem: {
  borderLeftWidth: 4,
  borderLeftColor: "#ec4899",
  backgroundColor: "#FFF1F2",
},

notificationText: {
  fontSize: 13,
  color: "#374151",
},

notificationDate: {
  fontSize: 11,
  color: "#9CA3AF",
  marginTop: 4,
},

markAllBtn: {
  marginTop: 8,
  padding: 10,
  borderRadius: 12,
  backgroundColor: "#E5F3F1",
  alignItems: "center",
},

markAllText: {
  fontSize: 13,
  fontWeight: "600",
  color: "#047857",
},


  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  studentName: {
    fontSize: 16,
    fontWeight: "600",
  },

  studentClass: {
    fontSize: 12,
    color: "#6B7280",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  formTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },

  submitBtn: {
    backgroundColor: "#047857",
    padding: 12,
    borderRadius: 12,
  },

  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  listCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  listTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  requestItem: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },

  dateText: {
    fontSize: 12,
    color: "#6B7280",
  },

  reasonText: {
    fontSize: 14,
    marginTop: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#047857",
  },

  statHint: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  requestTitle: {
    fontSize: 14,
    fontWeight: "600",
  },

  requestSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },

  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  statusBadge: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  noteCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },

  noteTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  noteText: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  padding: 16,
},

modalContainer: {
  backgroundColor: "#fff",
  borderRadius: 18,
  padding: 16,
},

modalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},

modalTitle: {
  fontSize: 16,
  fontWeight: "700",
},

modalLabel: {
  fontSize: 12,
  color: "#6B7280",
  marginBottom: 6,
  marginTop: 6,
},

readonlyInput: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  padding: 10,
  borderRadius: 10,
  backgroundColor: "#F9FAFB",
},

modalActions: {
  flexDirection: "row",
  gap: 10,
  marginTop: 14,
},

cancelBtn: {
  flex: 1,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 12,
  padding: 12,
  alignItems: "center",
},

modalNote: {
  flexDirection: "row",
  gap: 6,
  backgroundColor: "#ECFDF5",
  padding: 10,
  borderRadius: 10,
  marginTop: 10,
},

modalNoteText: {
  fontSize: 12,
  color: "#4B5563",
  flex: 1,
},


});
