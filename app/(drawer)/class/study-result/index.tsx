import { parentService } from "@/services/parentService";
import { ScoreReport, scoreService } from "@/services/scoreService";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Scores() {
  const [scoreData, setScoreData] = useState<ScoreReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [semester, setSemester] = useState(1);
  const [classId, setClassId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    loadIds();
  }, []);

  useEffect(() => {
    if (classId && studentId) {
      fetchScores();
    }
  }, [classId, studentId, semester]);

  const loadIds = async () => {
    const cid = await parentService.getStoredClassId();
    const sid = await parentService.getStoredStudentId();
    setClassId(cid);
    setStudentId(sid);
  };

  const fetchScores = async () => {
    if (!classId || !studentId) return;
    try {
      setLoading(true);
      const data = await scoreService.getScoresBySemester(
        classId,
        studentId,
        semester
      );
      setScoreData(data);
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  };

  const reloadScores = async () => {
    if (!classId || !studentId) return;
    try {
      setRefreshing(true);
      const data = await scoreService.getScoresBySemester(
        classId,
        studentId,
        semester
      );
      setScoreData(data);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading && !scoreData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#047857" />
        <Text style={styles.loadingText}>Đang tải bảng điểm...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={reloadScores}
          colors={["#047857"]}
          tintColor="#047857"
        />
      }
    >
      {/* Semester Selector */}
      <View style={styles.semesterContainer}>
        <TouchableOpacity
          style={[styles.semesterButton, semester === 1 && styles.semesterButtonActive]}
          onPress={() => setSemester(1)}
        >
          <Text style={[styles.semesterText, semester === 1 && styles.semesterTextActive]}>
            Học kỳ 1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.semesterButton, semester === 2 && styles.semesterButtonActive]}
          onPress={() => setSemester(2)}
        >
          <Text style={[styles.semesterText, semester === 2 && styles.semesterTextActive]}>
            Học kỳ 2
          </Text>
        </TouchableOpacity>
      </View>

      {scoreData ? (
        <>
          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <SummaryCard
              icon="analytics"
              label="Điểm trung bình"
              value={scoreData.averageScore.toFixed(1)}
              color="#047857"
              bgColor="#D1FAE5"
            />
            <SummaryCard
              icon="school"
              label="Tổng số môn"
              value={`${scoreData.subjectScores.length} môn`}
              color="#F59E0B"
              bgColor="#FEF3C7"
            />
            <SummaryCard
              icon="trophy"
              label="Xếp hạng"
              value={scoreData.rankInClass}
              color="#3B82F6"
              bgColor="#DBEAFE"
            />
          </View>

          {/* Additional Info */}
          <View style={styles.infoCard}>
            <InfoRow label="Học lực" value={scoreData.grade} valueColor="#047857" />
            <InfoRow label="Hạnh kiểm" value={scoreData.conduct || "Chưa có"} valueColor="#6366F1" />
            <InfoRow label="Kết quả cuối kỳ" value={scoreData.finalGrade} valueColor="#EC4899" />
          </View>

          {/* Scores Table */}
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.subjectColumn]}>Môn học</Text>
              <Text style={[styles.tableHeaderText, styles.scoreColumn]}>Điểm giữa kỳ</Text>
              <Text style={[styles.tableHeaderText, styles.scoreColumn]}>Điểm cuối kỳ</Text>
              <Text style={[styles.tableHeaderText, styles.scoreColumn]}>Điểm TB</Text>
            </View>

            {scoreData.subjectScores.map((subject, index) => (
              <ScoreRow
                key={subject.subjectId}
                subject={subject}
                isEven={index % 2 === 0}
              />
            ))}
          </View>

          {/* Notes Card */}
          <View style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteIcon}>📊</Text>
              <Text style={styles.noteTitle}>Ghi chú về điểm:</Text>
            </View>

            <View style={styles.noteList}>
              <Text style={styles.noteItem}>• Điểm được cập nhật sau mỗi lần kiểm tra</Text>
              <Text style={styles.noteItem}>
                • Liên hệ giáo viên nếu có thắc mắc về điểm số
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>Chưa có dữ liệu bảng điểm</Text>
        </View>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

/* ===== SUMMARY CARD ===== */
interface SummaryCardProps {
  icon: any;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

function SummaryCard({ icon, label, value, color, bgColor }: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIcon, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
    </View>
  );
}

/* ===== INFO ROW ===== */
interface InfoRowProps {
  label: string;
  value: string;
  valueColor: string;
}

function InfoRow({ label, value, valueColor }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={[styles.infoValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

/* ===== SCORE ROW ===== */
interface ScoreRowProps {
  subject: any;
  isEven: boolean;
}

function ScoreRow({ subject, isEven }: ScoreRowProps) {
  return (
    <View style={[styles.tableRow, isEven && styles.tableRowEven]}>
      <Text style={[styles.tableCell, styles.subjectColumn, styles.subjectName]}>
        {subject.subjectName}
      </Text>
      <Text style={[styles.tableCell, styles.scoreColumn, styles.scoreText]}>
        {subject.midtermScore.toFixed(1)}
      </Text>
      <Text style={[styles.tableCell, styles.scoreColumn, styles.scoreText]}>
        {subject.finalScore.toFixed(1)}
      </Text>
      <Text style={[styles.tableCell, styles.scoreColumn, styles.averageText]}>
        {subject.averageScore.toFixed(1)}
      </Text>
    </View>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },

  /* Header Card */
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  /* Semester Selector */
  semesterContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  semesterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },

  semesterButtonActive: {
    backgroundColor: "#047857",
    borderColor: "#047857",
  },

  semesterText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },

  semesterTextActive: {
    color: "#fff",
  },

  /* Summary Cards */
  summaryContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: "800",
  },

  /* Info Card */
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "800",
  },

  /* Table */
  tableCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#047857",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  tableHeaderText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  tableRowEven: {
    backgroundColor: "#F9FAFB",
  },

  tableCell: {
    fontSize: 13,
    textAlign: "center",
  },

  subjectColumn: {
    flex: 1,
    textAlign: "left",
  },

  scoreColumn: {
    flex: 1,
  },

  subjectName: {
    fontWeight: "700",
    color: "#111827",
  },

  scoreText: {
    color: "#6B7280",
    fontWeight: "600",
  },

  averageText: {
    color: "#047857",
    fontWeight: "800",
  },

  /* Empty State */
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },

  emptyText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 14,
  },

  /* Notes Card */
  noteCard: {
    backgroundColor: "#FFF7ED", // cam nhạt
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FDBA74",
  },

  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  noteIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  noteTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  noteList: {
    gap: 8,
  },

  noteItem: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
    lineHeight: 18,
  },
});