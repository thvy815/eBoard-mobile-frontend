import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function CustomDrawerContent(props: any) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        {/* HEADER PHỤ HUYNH */}
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Ionicons name="person" size={28} color="#4f9a94" />
            </View>

            <Text style={styles.role}>Phụ huynh</Text>
            <Text style={styles.name}>Nguyễn Văn A</Text>
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
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
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
