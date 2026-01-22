import ActivityDetailModal from "@/components/activity/ActivityDetailModal";
import { activityService } from "@/services/activityService";
import { ParentViewActivity } from "@/types/activity";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const CLASS_ID = "27f5cded-0c8a-4aa0-a099-718ac7434a3b";
const STUDENT_ID = "d8228fcb-558e-4742-b4a2-d1a294262935";

export default function ActivityScreen() {
  const router = useRouter();

  const [activities, setActivities] = useState<ParentViewActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    try {
      setLoading(true);

      const res = await activityService.getActivitiesForParent(
        CLASS_ID,
        STUDENT_ID
      );

      setActivities(res?.data ?? []);
    } catch (err) {
      console.log("❌ Load activities failed", err);

      // fallback để UI không trống khi BE chưa có
      setActivities([]);

      Alert.alert("Thông báo", "BE chưa sẵn sàng hoặc lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(activityId: string) {
    if (submittingId) return;

    try {
      setSubmittingId(activityId);

      await activityService.signInActivity({
        studentId: STUDENT_ID,
        activityId,
      });

      Alert.alert("✅ Thành công", "Đăng ký thành công");
      fetchActivities();
    } catch (err: any) {
      console.log("❌ Register error", err?.response?.data || err);

      Alert.alert("❌ Thất bại", err?.response?.data ?? "BE chưa sẵn sàng");
    } finally {
      setSubmittingId(null);
    }
  }

  async function handleCancel(activity: ParentViewActivity) {
    if (submittingId) return;

    try {
      setSubmittingId(activity.id);

      const participant = (activity.participants ?? []).find(
        (p) => p.studentId === STUDENT_ID
      );

      if (!participant?.id) {
        Alert.alert("Lỗi", "Không tìm thấy đăng ký");
        return;
      }

      await activityService.removeParticipant(participant.id);

      Alert.alert("✅ Thành công", "Đã hủy đăng ký");
      fetchActivities();
    } catch (err) {
      console.log("❌ Cancel error", err);
      Alert.alert("❌ Thất bại", "BE chưa sẵn sàng");
    } finally {
      setSubmittingId(null);
    }
  }



  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách hoạt động</Text>
        <Text style={styles.count}>{activities.length} hoạt động</Text>
      </View>

      {/* LOADING */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      )}

      {/* EMPTY */}
      {!loading && activities.length === 0 && (
        <Text style={styles.empty}>Chưa có hoạt động nào</Text>
      )}

      {/* LIST */}
      {!loading &&
        activities.map((item) => {
          const isRegistered = (item.participants ?? []).some(
            (p) => p.studentId === STUDENT_ID
          );

          return (
            <View key={item.id} style={styles.card}>
              {/* CARD PRESS */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedActivityId(item.id);
                  setShowModal(true);
                }}
              >
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>

                <InfoRow icon="calendar-outline">
                  {new Date(item.startTime).toLocaleDateString("vi-VN")} -{" "}
                  {new Date(item.endTime).toLocaleDateString("vi-VN")}
                </InfoRow>

                <InfoRow icon="cash-outline">
                  {(item.cost ?? 0).toLocaleString()}đ
                </InfoRow>

                <InfoRow icon="person-outline">
                  GV phụ trách: {item.inChargeTeacher || "Chưa có"}
                </InfoRow>
              </TouchableOpacity>

              {/* ACTION BUTTON */}
              {!isRegistered ? (
                <TouchableOpacity
                  disabled={submittingId === item.id}
                  style={[
                    styles.registerBtn,
                    submittingId === item.id && styles.disabledBtn,
                  ]}
                  onPress={() => handleRegister(item.id)}
                >
                  <Text style={styles.btnText}>
                    {submittingId === item.id ? "Đang đăng ký..." : "Đăng ký"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled={submittingId === item.id}
                  style={[
                    styles.cancelBtn,
                    submittingId === item.id && styles.disabledBtn,
                  ]}
                  onPress={() => handleCancel(item)}
                >
                  <Text style={styles.btnText}>
                    {submittingId === item.id ? "Đang hủy..." : "Hủy đăng ký"}
                  </Text>
                </TouchableOpacity>
              )}
              {selectedActivityId && (
                <ActivityDetailModal
                  visible={showModal}
                  activityId={selectedActivityId}
                  onClose={() => setShowModal(false)}
                />
              )}
            </View>
          );
        })}
    </ScrollView>
  );
}

function InfoRow({
  icon,
  children,
}: {
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#6B7280" />
      <Text style={styles.infoText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  count: {
    fontSize: 12,
    color: "#6B7280",
  },

  center: {
    marginTop: 40,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 8,
    color: "#6B7280",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
  },

  description: {
    fontSize: 13,
    color: "#6B7280",
    marginVertical: 6,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 13,
  },

  registerBtn: {
    marginTop: 12,
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  cancelBtn: {
    marginTop: 12,
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  disabledBtn: {
    opacity: 0.6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
