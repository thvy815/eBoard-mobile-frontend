import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authSession } from "@/services/authSession";
import { parentService } from "@/services/parentService";
import type { ParentInfo } from "@/types/parent";

export function CustomDrawerContent(props: any) {
  const [parent, setParent] = useState<ParentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const parentId = await authSession.getParentId();
        if (!parentId) {
          if (mounted) setParent(null);
          return;
        }

        const info = await parentService.getParentInfo(parentId);
        if (mounted) setParent(info);
      } catch {
        if (mounted) setParent(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const nameText = loading ? "Đang tải..." : parent?.fullName ?? "Phụ huynh";

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        {/* HEADER PHỤ HUYNH */}
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Ionicons name="person" size={28} color="#4f9a94" />
            </View>

            <Text style={styles.role}>Phụ huynh</Text>
            <Text style={styles.name}>{nameText}</Text>
          </View>
        </View>

        {/* MENU */}
        <View style={styles.menu}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: "#4f9a94",
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    alignItems: "center",
    paddingTop: 16,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  role: {
    color: "#dff3f1",
    fontSize: 13,
  },
  name: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 2,
  },
  menu: {
    paddingTop: 12,
  },
});
