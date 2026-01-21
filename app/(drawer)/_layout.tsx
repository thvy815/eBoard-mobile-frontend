import { CustomDrawerContent } from "@/components/ui/CustomerDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer
      initialRouteName="class"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: { width: 260 },
      }}
    >
      <Drawer.Screen
        name="class"
        options={{
          title: "Lớp học của con",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="activity/index"
        options={{
          title: "Hoạt động ngoại khóa",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="football-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="violation/index"
        options={{
          title: "Cảnh báo vi phạm",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="alert-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="setting/index"
        options={{
          title: "Cài đặt",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      {/* ✅ ẨN ROUTE CON KHỎI DRAWER (không hiện setting/... nữa) */}
      <Drawer.Screen
        name="setting/profile"
        options={{ drawerItemStyle: { display: "none" }, title: "Thông tin cá nhân" }}
      />
      <Drawer.Screen
        name="setting/student"
        options={{ drawerItemStyle: { display: "none" }, title: "Thông tin học sinh" }}
      />
      <Drawer.Screen
        name="setting/security"
        options={{ drawerItemStyle: { display: "none" }, title: "Bảo mật" }}
      />
      <Drawer.Screen
        name="setting/notifications"
        options={{ drawerItemStyle: { display: "none" }, title: "Thông báo" }}
      />
      <Drawer.Screen
        name="setting/help"
        options={{ drawerItemStyle: { display: "none" }, title: "Trợ giúp" }}
      />
    
    </Drawer>
  );
}
