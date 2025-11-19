import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  hidden?: boolean;
}

export const BannerAd: React.FC<Props> = ({ hidden }) => {
  if (hidden) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Banner Ad (placeholder)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  text: { color: "#888", fontSize: 12 },
});
