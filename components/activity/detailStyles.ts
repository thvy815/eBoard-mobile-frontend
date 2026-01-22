import { StyleSheet } from "react-native";

export const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 14,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  label: {
    fontSize: 12,
    color: "#6B7280",
  },

  value: {
    fontSize: 14,
    fontWeight: "500",
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },

  infoItem: {
    width: "48%",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptyBox: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    alignItems: "center",
  },

  warningBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 12,
  },

  warningText: {
    fontSize: 13,
    color: "#92400E",
    marginBottom: 4,
  },

  registerButton: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },

  registerButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
