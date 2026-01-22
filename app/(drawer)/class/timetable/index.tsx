import { parentService } from "@/services/parentService";
import { scheduleService, TimetableItem } from "@/services/scheduleService";
import { ScheduleSettingsResponse } from "@/types/scheduleSettings";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Schedule() {
  const [schedules, setSchedules] = useState<TimetableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [classId, setClassId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ScheduleSettingsResponse | null>(null);

  useEffect(() => {
    const loadClassId = async () => {
      try {
        const storedClassId = await parentService.getStoredClassId();
        setClassId(storedClassId);
      } catch (error) {
        console.error("Error loading class ID:", error);
      }
    };
    loadClassId();
  }, []);

  useEffect(() => {
    if (!classId) return;
    fetchSchedules(classId);

    // fetch giờ học
    (async () => {
      const s = await scheduleService.getSettings(classId);
      setSettings(s);
    })();
  }, [classId]);

  const fetchSchedules = async (cid: string) => {
    try {
      setLoading(true);
      const res = await scheduleService.getByClassId(cid);
      setSchedules(res);
    } catch (e) {
      console.error("Lỗi lấy thời khóa biểu:", e);
    } finally {
      setLoading(false);
    }
  };

  const reloadSchedules = async () => {
    if (!classId) return;
    try {
      setRefreshing(true);
      const res = await scheduleService.getByClassId(classId);
      setSchedules(res);
    } catch (e) {
      console.error("Lỗi reload thời khóa biểu:", e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setWeekDates(getWeekDates(selectedDate));
  }, [selectedDate]);

  const filteredSchedules = schedules.filter((schedule) => {
    const selectedDay = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay();
    return schedule.day === selectedDay;
  });

  const morningSchedules = filteredSchedules
    .filter((s) => s.isMorning)
    .sort((a, b) => a.period - b.period);

  const afternoonSchedules = filteredSchedules
    .filter((s) => !s.isMorning)
    .sort((a, b) => a.period - b.period);

  const today = new Date().toDateString();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={reloadSchedules} colors={["#047857"]} tintColor="#047857" />
      }
    >
      {/* ===== WEEK CALENDAR ===== */}
      <View style={styles.weekContainer}>
        <View style={styles.weekHeader}>
          <Ionicons
            name="chevron-back"
            size={22}
            color="#047857"
            onPress={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 7);
              setSelectedDate(newDate);
            }}
          />
          <Text style={styles.weekTitle}>{getDayOfWeekText(selectedDate)}</Text>
          <Ionicons
            name="chevron-forward"
            size={22}
            color="#047857"
            onPress={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 7);
              setSelectedDate(newDate);
            }}
          />
        </View>

        <View style={styles.weekDays}>
          {weekDates.map((date) => {
            const isActive = date.toDateString() === selectedDate.toDateString();
            return (
              <View
                key={date.toISOString()}
                style={[styles.dayButton, isActive && styles.dayButtonActive]}
                onTouchEnd={() => setSelectedDate(new Date(date))}
              >
                <Text style={[styles.dayButtonLabel, isActive && styles.dayButtonLabelActive]}>
                  Thứ {date.getDay() + 1}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ===== LOADING & EMPTY STATE ===== */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#047857" />
          <Text style={styles.infoText}>Đang tải...</Text>
        </View>
      )}

      {!loading && filteredSchedules.length === 0 && (
        <View style={styles.centerContainer}>
          <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
          <Text style={styles.infoText}>Không có lịch học trong ngày này</Text>
        </View>
      )}

      {/* ===== CONTENT ===== */}
      {!loading && morningSchedules.length > 0 && (
        <>
          <View style={styles.sessionHeader}>
            <View style={[styles.sessionIconBox, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="sunny" size={18} color="#D97706" />
            </View>
            <Text style={styles.sessionTitle}>Buổi Sáng</Text>
          </View>
          {morningSchedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} settings={settings} />
          ))}
        </>
      )}

      {!loading && afternoonSchedules.length > 0 && (
        <>
          <View style={styles.sessionHeader}>
             <View style={[styles.sessionIconBox, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="partly-sunny" size={18} color="#D97706" />
            </View>
            <Text style={styles.sessionTitle}>Buổi Chiều</Text>
          </View>
          {afternoonSchedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} settings={settings} />
          ))}
        </>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ===== NEW SCHEDULE CARD DESIGN ===== */
function ScheduleCard({
  schedule,
  settings,
}: {
  schedule: TimetableItem;
  settings: ScheduleSettingsResponse | null;
}) {
  const timeRange = getPeriodTimeFromSettings(
    schedule.period,
    schedule.isMorning,
    settings
  );

  const theme = getSubjectTheme(schedule.subject);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftColumn}>
        <Text style={styles.timeText}>{timeRange.start}</Text>
        <View style={styles.verticalLine} />
        <Text style={styles.timeTextEnd}>{timeRange.end}</Text>
      </View>

      <View style={[styles.rightCard, { borderLeftColor: theme.color }]}>
        <View style={[styles.cardHeader, { backgroundColor: theme.bg }]}>
          <Text style={[styles.subjectName, { color: theme.darkColor }]}>
            {schedule.subject}
          </Text>
          <Text style={styles.periodLabel}>Tiết {schedule.period}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.rowItem}>
            <Ionicons name="person-outline" size={14} color="#6B7280" />
            <Text style={styles.teacherText}>{schedule.teacher}</Text>
          </View>

          {schedule.content && schedule.content !== "Không" && (
            <View style={styles.rowItem}>
              <Ionicons name="document-text-outline" size={14} color="#6B7280" />
              <Text style={styles.noteText} numberOfLines={1}>
                {schedule.content}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

/* ===== HELPERS ===== */
const getWeekDates = (date: Date) => {
  const start = new Date(date);

  // Đưa về Thứ 2 của tuần hiện tại
  const day = start.getDay(); // 0 = CN, 1 = T2, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);

  // Lấy 5 ngày: T2 -> T6
  return Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

const getDayOfWeekText = (date: Date) => {
  const day = date.getDay();
  return `Thứ ${day === 0 ? "CN" : day + 1}`;
};

const getPeriodTimeFromSettings = (
  period: number,
  isMorning: boolean,
  settings: ScheduleSettingsResponse | null
) => {
  if (!settings?.details?.length) {
    return { start: "--:--", end: "--:--" };
  }

  const match = settings.details.find(
    (d) => d.periodNumber === period && d.isMorningPeriod === isMorning
  );

  if (!match) return { start: "--:--", end: "--:--" };

  return {
    start: match.startTime.slice(0, 5), // "08:00"
    end: match.endTime.slice(0, 5),     // "08:45"
  };
};

// Màu sắc theo môn học
const getSubjectTheme = (subjectName?: string) => {
  const defaultTheme = { bg: "#F3F4F6", color: "#9CA3AF", darkColor: "#374151" };
  if (!subjectName) return defaultTheme;

  const map: Record<string, any> = {
    "Toán": { bg: "#DBEAFE", color: "#3B82F6", darkColor: "#1E40AF" },
    "Văn": { bg: "#FCE7F3", color: "#EC4899", darkColor: "#9D174D" },
    "Ngữ văn": { bg: "#FCE7F3", color: "#EC4899", darkColor: "#9D174D" },
    "Tiếng Anh": { bg: "#FEE2E2", color: "#EF4444", darkColor: "#991B1B" },
    "Vật Lý": { bg: "#FEF3C7", color: "#F59E0B", darkColor: "#92400E" },
    "Hóa Học": { bg: "#CCFBF1", color: "#14B8A6", darkColor: "#115E59" },
    "Sinh Học": { bg: "#D9F99D", color: "#84CC16", darkColor: "#3F6212" },
    "Lịch Sử": { bg: "#E9D5FF", color: "#A855F7", darkColor: "#6B21A8" },
    "Địa Lý": { bg: "#D1FAE5", color: "#10B981", darkColor: "#065F46" },
    "Giáo dục công dân": { bg: "#FFEDD5", color: "#F97316", darkColor: "#9A3412" },
    "Tin Học": { bg: "#E0E7FF", color: "#6366F1", darkColor: "#3730A3" },
    "Thể Dục": { bg: "#FFEDD5", color: "#F97316", darkColor: "#9A3412" },
  };

  // Tìm màu gần đúng (vd: "Toán học" -> khớp "Toán")
  for (const key in map) {
    if (subjectName.includes(key)) return map[key];
  }

  return defaultTheme;
};

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Màu nền sáng sạch hơn
    padding: 16,
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  infoText: {
    color: "#9CA3AF",
    marginTop: 10,
    fontSize: 14,
  },

  /* Week Calendar Styles */
  weekContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
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
    fontWeight: "700",
    color: "#1F2937",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  dayButtonActive: {
    backgroundColor: "#047857",
  },
  dayButtonLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  dayButtonLabelActive: {
    color: "#fff",
  },

  /* Session Header */
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sessionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sessionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },

  /* ===== CARD STYLES ===== */
  cardContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: 'stretch', // Kéo giãn chiều cao bằng nhau
  },
  
  // Cột bên trái (Thời gian)
  leftColumn: {
    width: 50,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
    marginRight: 10,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#E2E8F0", // Đường kẻ dọc nối thời gian
    marginVertical: 4,
    borderRadius: 1,
  },
  timeTextEnd: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  // Card bên phải (Nội dung)
  rightCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderLeftWidth: 4, // Viền màu bên trái phân biệt môn
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "800", // Rất đậm để nổi bật
    flex: 1,
    marginRight: 8,
  },
  periodLabel: {
    fontSize: 11,
    color: "#6B7280", // Nhạt đi theo yêu cầu
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: "500",
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  teacherText: {
    fontSize: 13,
    color: "#4B5563",
    marginLeft: 6,
    fontWeight: "500",
  },
  noteText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
    fontStyle: "italic",
    flex: 1,
  },
});