
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { useSoundSetting } from "../context/SoundContext";
import { BannerAd } from "../components/BannerAd";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { muted, toggleMuted } = useSoundSetting();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Button title={muted ? "사운드 꺼짐" : "사운드 켜짐"} onPress={toggleMuted} />
      </View>
      <BannerAd />
      <Text style={styles.title}>랜덤 캐릭터 합성기</Text>
      <Text style={styles.subtitle}>이상한 조합의 친구들을 만들어보자!</Text>

      <Button title="무료 뽑기" onPress={() => navigation.navigate("PartsSelection", { isPremium: false })} />
      <View style={{ height: 12 }} />
      <Button title="프리미엄 뽑기 (광고 자리)" onPress={() => navigation.navigate("PartsSelection", { isPremium: true })} />

      <View style={styles.bottomButtons}>
        <Button
          title="내 도감 보기"
          onPress={() => navigation.navigate("Collection")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  topRow: { width: "100%", alignItems: "flex-end", marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  bottomButtons: { marginTop: 30 }
});
