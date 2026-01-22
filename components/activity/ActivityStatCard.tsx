import React from "react";
import { Text, View } from "react-native";
import { activityStyles } from "./styles";

interface Props {
  label: string;
  value: number;
  color: "green" | "orange";
}

export default function ActivityStatCard({ label, value, color }: Props) {
  return (
    <View style={activityStyles.statBox}>
      <Text style={activityStyles.statLabel}>{label}</Text>
      <Text
        style={
          color === "green"
            ? activityStyles.statValueGreen
            : activityStyles.statValueOrange
        }
      >
        {value}
      </Text>
    </View>
  );
}
