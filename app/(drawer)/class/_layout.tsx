import { Stack } from "expo-router";
import React from "react";

const BACK_TITLE = "Quay lại";

export default function ClassLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // mặc định KHÔNG header
      }}
    >
      {/* Dashboard - KHÔNG header */}
      <Stack.Screen name="index" />

      {/* Các màn hình con - CÓ header */}
      <Stack.Screen
        name="attendance/index"
        options={{ headerShown: true, title: "Điểm danh", headerBackTitle: BACK_TITLE }}
      />
      <Stack.Screen
        name="exam/index"
        options={{ headerShown: true, title: "Lịch thi", headerBackTitle: BACK_TITLE }}
      />
      <Stack.Screen
        name="fund/index"
        options={{ headerShown: true, title: "Quỹ lớp", headerBackTitle: BACK_TITLE }}
      />
      <Stack.Screen
        name="study-result/index"
        options={{ headerShown: true, title: "Kết quả học tập", headerBackTitle: BACK_TITLE }}
      />
      <Stack.Screen
        name="timetable/index"
        options={{ headerShown: true, title: "Thời khóa biểu", headerBackTitle: BACK_TITLE }}
      />
    </Stack>
  );
}
