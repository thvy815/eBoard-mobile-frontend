import { parentService } from "@/services/parentService";
import { Violation, violationService } from "@/services/violationService";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterLevel = "all" | 0 | 1 | 2;

export default function Violations() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("all");
  const [classId, setClassId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    loadIds();
  }, []);

  useEffect(() => {
    if (classId && studentId) {
      fetchViolations();
    }
  }, [classId, studentId]);

  const loadIds = async () => {
    const cid = await parentService.getStoredClassId();
    const sid = await parentService.getStoredStudentId();
    setClassId(cid);
    setStudentId(sid);
  };

  const fetchViolations = async () => {
    if (!classId || !studentId) return;
    try {
      setLoading(true);
      const data = await violationService.getViolations(classId, studentId);
      setViolations(data);
    } catch (error) {
      console.error("Error fetching violations:", error);
    } finally {
      setLoading(false);
    }
  };

  const reloadViolations = async () => {
    if (!classId || !studentId) return;
    try {
      setRefreshing(true);
      const data = await violationService.getViolations(classId, studentId);
      setViolations(data);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkAsSeen = async (violationId: string) => {
    if (!studentId) return; // Chỉ cần studentId, không cần classId

    const success = await violationService.markAsSeen(
      violationId,
      studentId
    );

    if (success) {
      setViolations((prev) =>
        prev.map((v) =>
          v.id === violationId ? { ...v, seenByParent: true } : v
        )
      );
      Alert.alert("Thành công", "Đã xác nhận vi phạm");
    } else {
      Alert.alert("Lỗi", "Không thể xác nhận. Vui lòng thử lại");
    }
  };

  const filteredViolations = violations.filter((v) => {
    if (filterLevel === "all") return true;
    return v.violationLevel === filterLevel;
  });

  const seenCount = violations.filter((v) => v.seenByParent).length;
  const unseenCount = violations.filter((v) => !v.seenByParent).length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={reloadViolations}
          colors={["#047857"]}
          tintColor="#047857"
        />
      }
    >
      {/* ===== STATISTICS ===== */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconWrapper}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
          <Text style={styles.statLabel}>Đã xác nhận</Text>
          <Text style={styles.statNumber}>{seenCount}</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconWrapper, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="time" size={20} color="#F59E0B" />
          </View>
          <Text style={styles.statLabel}>Chờ xác nhận</Text>
          <Text style={styles.statNumber}>{unseenCount}</Text>
        </View>
      </View>

      {/* ===== FILTER - REDESIGNED ===== */}
      <View style={styles.filterContainer}>
        <FilterButton
          label="Tất cả"
          active={filterLevel === "all"}
          onPress={() => setFilterLevel("all")}
          activeColor="#E0F2FE"
          activeTextColor="#0369A1"
        />
        <FilterButton
          label="Nhẹ"
          active={filterLevel === 0}
          onPress={() => setFilterLevel(0)}
          activeColor="#FEF3C7"
          activeTextColor="#B45309"
        />
        <FilterButton
          label="TB"
          active={filterLevel === 1}
          onPress={() => setFilterLevel(1)}
          activeColor="#FCE7F3"
          activeTextColor="#BE185D"
        />
        <FilterButton
          label="Nặng"
          active={filterLevel === 2}
          onPress={() => setFilterLevel(2)}
          activeColor="#FEE2E2"
          activeTextColor="#B91C1C"
        />
      </View>

      {/* ===== LOADING ===== */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#047857" />
          <Text style={styles.infoText}>Đang tải...</Text>
        </View>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && filteredViolations.length === 0 && (
        <View style={styles.centerContainer}>
          <Ionicons name="checkmark-done-circle-outline" size={64} color="#D1D5DB" />
          <Text style={styles.infoText}>Không có vi phạm nào</Text>
        </View>
      )}

      {/* ===== VIOLATIONS LIST ===== */}
      {!loading &&
        filteredViolations.map((violation) => (
          <ViolationCard
            key={violation.id}
            violation={violation}
            onMarkAsSeen={handleMarkAsSeen}
          />
        ))}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

/* ===== FILTER BUTTON - REDESIGNED ===== */
interface FilterButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor: string;      // Màu nền khi active (pastel nhẹ)
  activeTextColor: string;  // Màu chữ khi active (đậm hơn một chút)
}

function FilterButton({ label, active, onPress, activeColor, activeTextColor }: FilterButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        active && { 
          backgroundColor: activeColor,
          borderColor: activeTextColor,
          borderWidth: 1.5,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterButtonText,
          active && { color: activeTextColor, fontWeight: "700" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ===== VIOLATION CARD ===== */
interface ViolationCardProps {
  violation: Violation;
  onMarkAsSeen: (id: string) => void;
}

function ViolationCard({ violation, onMarkAsSeen }: ViolationCardProps) {
  const levelConfig = getLevelConfig(violation.violationLevel);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: levelConfig.lightBg }]}>
          <Ionicons name={levelConfig.icon} size={24} color={levelConfig.color} />
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.violationType}>{violation.violationType}</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
            <Text style={styles.dateText}>
              {formatDate(violation.violateDate)}
            </Text>
          </View>
        </View>

        <View style={[styles.levelBadge, { backgroundColor: levelConfig.bg }]}>
          <Text style={[styles.levelBadgeText, { color: levelConfig.color }]}>
            {levelConfig.label}
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        {violation.violationInfo && violation.violationInfo !== "Không có" && (
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.infoTextBody}>{violation.violationInfo}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color="#6B7280" />
          <Text style={styles.infoLabel}>Giáo viên: </Text>
          <Text style={styles.infoValue}>{violation.inChargeTeacherName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="warning-outline" size={16} color="#6B7280" />
          <Text style={styles.infoLabel}>Hình phạt: </Text>
          <Text style={styles.infoValue}>{violation.penalty}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        {violation.seenByParent ? (
          <View style={styles.seenBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.seenText}>Đã xác nhận</Text>
          </View>
        ) : (
          <>
            <View style={styles.unseenBadge}>
              <Ionicons name="time" size={16} color="#F59E0B" />
              <Text style={styles.unseenText}>Chờ xác nhận</Text>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => onMarkAsSeen(violation.id)}
            >
              <Text style={styles.confirmButtonText}>Xác nhận đã xem</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

/* ===== HELPERS ===== */
const getLevelConfig = (level: number) => {
  const configs = [
    {
      label: "Nhẹ",
      color: "#F59E0B",
      bg: "#FEF3C7",
      lightBg: "#FFFBEB",
      icon: "alert-circle" as any,
    },
    {
      label: "Trung bình",
      color: "#EC4899",
      bg: "#FCE7F3",
      lightBg: "#FDF2F8",
      icon: "warning" as any,
    },
    {
      label: "Nặng",
      color: "#EF4444",
      bg: "#FEE2E2",
      lightBg: "#FEF2F2",
      icon: "alert" as any,
    },
  ];

  return configs[level] || configs[0];
};

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

/* ===== STYLES ===== */
const PRIMARY = "#059669";
const BG = "#F8FAFC";
const CARD_BG = "#FFFFFF";
const TEXT = "#111827";
const MUTED = "#6B7280";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    padding: 16,
  },

  /* ===== Statistics ===== */
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 4,
    fontWeight: "600",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT,
  },

  /* ===== Filter - REDESIGNED ===== */
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",  // Nền xám siêu nhẹ
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",      // Viền xám nhạt
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",            // Chữ xám nhẹ khi inactive
  },

  /* ===== Loading / Empty ===== */
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  infoText: {
    color: "#9CA3AF",
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },

  /* ===== Card ===== */
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 6,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerContent: {
    flex: 1,
  },
  violationType: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#94A3B8",
    marginLeft: 4,
    fontWeight: "600",
  },

  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: "800",
  },

  cardBody: {
    padding: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 13,
    color: MUTED,
    marginLeft: 6,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 13,
    color: TEXT,
    fontWeight: "700",
    flex: 1,
  },
  infoTextBody: {
    fontSize: 13,
    color: "#374151",
    marginLeft: 6,
    flex: 1,
    fontWeight: "500",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  seenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  seenText: {
    fontSize: 13,
    color: "#059669",
    fontWeight: "800",
    marginLeft: 6,
  },

  unseenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  unseenText: {
    fontSize: 13,
    color: "#D97706",
    fontWeight: "800",
    marginLeft: 6,
  },

  /* ===== CONFIRM BUTTON - NỔI BẬT NHẤT ===== */
  confirmButton: {
    backgroundColor: "#059669",    // Xanh đậm
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,

    // Shadow mạnh hơn để nổi bật
    shadowColor: "#047857",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 8,
  },

  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",           // Font đậm nhất
    letterSpacing: 0.3,
  },
});