import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HelpScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Trợ giúp",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Ionicons
              name="chevron-back"
              size={24}
              color="#111827"
              style={{ marginLeft: 8 }}
              onPress={() => router.replace("/(drawer)/setting")}
            />
          ),
        }}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Trợ giúp</Text>
        <Text style={styles.sub}>Chừa chỗ gắn nội dung hỗ trợ sau.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 18, fontWeight: "900", color: "#111827" },
  sub: { marginTop: 6, color: "#6B7280", fontWeight: "600", textAlign: "center" },
});
