import { StyleSheet } from "react-native";

export const activityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 16,
  },

  summaryCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 8,
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    width: "48%",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  statValueGreen: {
    fontSize: 20,
    fontWeight: "700",
    color: "#059669",
  },

  statValueOrange: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F59E0B",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  count: {
    fontSize: 12,
    color: "#6B7280",
  },

  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  location: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  time: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  cost: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "500",
  },
});
