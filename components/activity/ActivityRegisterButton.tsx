import React from "react";
import { Pressable, Text } from "react-native";
import { detailStyles } from "./detailStyles";

export default function ActivityRegisterButton({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={[
        detailStyles.registerButton,
        disabled && { backgroundColor: "#9CA3AF" },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={detailStyles.registerButtonText}>
        Đăng ký ngay
      </Text>
    </Pressable>
  );
}
