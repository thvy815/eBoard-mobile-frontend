import { activityService } from "@/services/activityService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet as RNStyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ActivityParticipant = {
  id: string;
  studentId: string;
  studentName: string;
  parentPhoneNumber: string;
  teacherComments?: string;
  notes?: string;
};

type Props = {
  visible: boolean;
  activityId: string | null;
  onClose: () => void;
};

export default function ActivityDetailModal({
  visible,
  activityId,
  onClose,
}: Props) {
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activityId) fetchDetail();
  }, [activityId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await activityService.getActivityById(activityId!);
      setActivity(res.data);
    } catch (e) {
      console.log("❌ Load detail error", e);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  const joinedCount = activity?.participants?.length ?? 0;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chi tiết hoạt động</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* LOADING */}
          {loading && <Text style={{ padding: 16 }}>Đang tải...</Text>}

          {/* CONTENT */}
          {!loading && activity && (
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
              <Text style={styles.title}>{activity.name}</Text>

              <Info icon="location-outline" text={activity.location} />
              <Info
                icon="people-outline"
                text={`${joinedCount}/${activity.maxParticipants} học sinh`}
              />
              <Info
                icon="calendar-outline"
                text={`${formatDate(activity.startTime)} - ${formatDate(
                  activity.endTime
                )}`}
              />
              <Info
                icon="time-outline"
                text={`Hạn đăng ký: ${formatDate(activity.assignDeadline)}`}
              />
              <Info
                icon="cash-outline"
                text={`${activity.cost?.toLocaleString()}đ`}
              />
              <Info
                icon="person-outline"
                text={`GV phụ trách: ${activity.inChargeTeacher}`}
              />

              <Section title="Mô tả hoạt động">
                <Text style={styles.desc}>{activity.description}</Text>
              </Section>

              <Section
                title={`Danh sách tham gia (${joinedCount}/${activity.maxParticipants})`}
              >
                {joinedCount === 0 && (
                  <Text style={styles.empty}>Chưa có học sinh tham gia</Text>
                )}

                {activity.participants?.map((p: ActivityParticipant) => (
                  <View key={p.id} style={styles.participant}>
                    <Ionicons
                      name="person-circle-outline"
                      size={24}
                      color="#64748B"
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.participantName}>
                        {p.studentName}
                      </Text>
                      <Text style={styles.phone}>
                        {p.parentPhoneNumber}
                      </Text>
                    </View>
                  </View>
                ))}
              </Section>

              <Section title="Lưu ý quan trọng">
                <Text style={styles.note}>• Đảm bảo đóng phí đúng hạn</Text>
                <Text style={styles.note}>
                  • Chuẩn bị đầy đủ đồ dùng cần thiết
                </Text>
                <Text style={styles.note}>
                  • Liên hệ GV nếu có thắc mắc
                </Text>
              </Section>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

function Info({ icon, text }: { icon: any; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color="#64748B" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("vi-VN");
}

const styles = RNStyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: "92%",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },

  badgeText: {
    color: "#92400E",
    fontSize: 12,
    fontWeight: "600",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 14,
  },

  section: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },

  desc: {
    fontSize: 14,
    color: "#4B5563",
  },

  empty: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  participant: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  participantName: {
    fontSize: 14,
    fontWeight: "600",
  },

  phone: {
    fontSize: 12,
    color: "#6B7280",
  },

  note: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 4,
  },
});
