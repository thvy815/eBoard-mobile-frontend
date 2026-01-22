import { examService } from "@/services/examService";
import { parentService } from "@/services/parentService";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Exam() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [classId, setClassId] = useState<string | null>(null);

  useEffect(() => {
    const loadClassId = async () => {
      const storedClassId = await parentService.getStoredClassId();
      setClassId(storedClassId);
    };

    loadClassId();
  }, []);

  useEffect(() => {
    if (!classId) return;
    fetchExams(classId);
  }, [classId]);

  const fetchExams = async (cid: string) => {
    try {
      setLoading(true);
      const res = await examService.getByClass(cid);
      setExams(res.data);
    } catch (e) {
      console.log("Lỗi lấy lịch thi", e);
    } finally {
      setLoading(false);
    }
  };

  const reloadExams = async () => {
    if (!classId) return;

    try {
      setRefreshing(true);
      const res = await examService.getByClass(classId);
      setExams(res.data);
    } catch (e) {
      console.log("Lỗi reload lịch thi", e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setWeekDates(getWeekDates(selectedDate));
  }, [selectedDate]);

  const filteredExams = exams.filter((exam) => {
    const examDate = new Date(exam.startTime).toDateString();
    return examDate === selectedDate.toDateString();
  });

  const today = new Date().toDateString();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={reloadExams}
          colors={["#047857"]}      // Android
          tintColor="#047857"       // iOS
        />
      }
    >
      {/* ===== WEEK CALENDAR ===== */}
      <View style={styles.weekContainer}>
        <View style={styles.weekHeader}>
          <Ionicons
            name="chevron-back"
            size={22}
            onPress={() =>
              setSelectedDate(
                new Date(selectedDate.setDate(selectedDate.getDate() - 7))
              )
            }
          />

          <Text style={styles.weekTitle}>
            Tháng {selectedDate.getMonth() + 1} - {selectedDate.getFullYear()}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={22}
            onPress={() =>
              setSelectedDate(
                new Date(selectedDate.setDate(selectedDate.getDate() + 7))
              )
            }
          />
        </View>

        <View style={styles.weekDays}>
          {weekDates.map((date) => {
            const isActive = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === today;
            const isHasExam = hasExamOnDate(date, exams);

            return (
              <View key={date.toISOString()} style={styles.dayWrapper}>
                <Text style={styles.dayLabel}>
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][date.getDay() - 1]}
                </Text>

                <View
                  style={[
                    styles.dayCircle,
                    isHasExam && !isActive && styles.dayHasExam,
                    isActive && styles.dayActive,
                  ]}
                  onTouchEnd={() => setSelectedDate(date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isActive && styles.dayActiveText,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </View>
                {isToday && <View style={styles.todayDot} />}
              </View>
            );
          })}
        </View>
      </View>

      {loading && <Text>Đang tải...</Text>}

      {!loading && filteredExams.length === 0 && (
        <Text style={{ textAlign: "center", color: "#9CA3AF", marginTop: 20 }}>
          Không có lịch thi trong ngày này
        </Text>
      )}

      {filteredExams.map((exam) => (
        <View key={exam.id} style={styles.examCard}>
          {/* ===== Header ===== */}
          <View style={styles.examHeader}>
            <Ionicons name="book-outline" size={20} color="#047857" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.subject}>
                {exam.subject?.name}
              </Text>
              <Text style={styles.format}>
                {exam.examFormat}
              </Text>
            </View>
          </View>

          {/* ===== Content ===== */}
          <View style={styles.examContent}>
            <InfoRow
              icon="calendar-outline"
              label="Ngày thi"
              value={formatDate(exam.startTime)}
            />

            <InfoRow
              icon="time-outline"
              label="Giờ thi"
              value={formatTime(exam.startTime)}
            />

            <InfoRow
              icon="location-outline"
              label="Phòng thi"
              value={exam.location || "Chưa cập nhật"}
            />

            {/* ===== GHI CHÚ ===== */}
            {exam.notes ? (
              <>
                <Text style={styles.noteLabel}>Ghi chú:</Text>
                <Text style={styles.noteText}>{exam.notes}</Text>
              </>
            ) : null}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

/* ===== Helpers ===== */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN");

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const getWeekDates = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay() || 7; // CN = 7
  start.setDate(start.getDate() - day + 1); // Thứ 2

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const hasExamOnDate = (date: Date, exams: any[]) => {
  return exams.some((exam) => {
    return (
      new Date(exam.startTime).toDateString() === date.toDateString()
    );
  });
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color="#6B7280" />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

/* ===== Styles ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  examCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  examHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C7F0E5",
    padding: 14,
  },

  subject: {
    fontSize: 15,
    fontWeight: "600",
  },

  format: {
    fontSize: 12,
    color: "#6B7280",
  },

  examContent: {
    padding: 14,
    backgroundColor: "#FAFAFA",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },

  noteLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
  },

  noteText: {
    fontSize: 14,
    marginTop: 4,
    color: "#374151",
  },

  weekContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  weekTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dayWrapper: {
    alignItems: "center",
    width: 42,
  },

  dayLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
  },

  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  dayText: {
    fontSize: 14,
    color: "#111827",
  },

  dayActive: {
    backgroundColor: "#047857",
  },

  dayActiveText: {
    color: "#fff",
    fontWeight: "600",
  },

  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#047857",
    
    marginTop: 4,
  },

  dayHasExam: {
    backgroundColor: "#FFEDD5", 
  },
});
