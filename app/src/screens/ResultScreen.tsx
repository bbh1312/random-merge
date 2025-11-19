
import React, { useState } from "react";
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCollection } from "../context/CollectionContext";
import { useSoundSetting } from "../context/SoundContext";
import { BannerAd } from "../components/BannerAd";
import { generateCharacter } from "../services/api";
import { getDeviceId } from "../utils/deviceId";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export const ResultScreen: React.FC<Props> = ({ navigation }) => {
  const { collection, replaceLatest } = useCollection();
  const { muted, toggleMuted } = useSoundSetting();
  const [rerolling, setRerolling] = useState(false);
  const latest = collection[0];

  if (!latest) {
    return (
      <View style={styles.center}>
        <Text>아직 생성된 캐릭터가 없어요.</Text>
        <Button title="뽑으러 가기" onPress={() => navigation.navigate("Home")} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BannerAd />
      <View style={styles.topRow}>
        <Button title={muted ? "사운드 꺼짐" : "사운드 켜짐"} onPress={toggleMuted} />
      </View>
      <Text style={styles.name}>{latest.name}</Text>
      <Text style={styles.parts}>{latest.parts.join(" + ")}</Text>
      <Image
        source={{ uri: latest.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.description}>{latest.description}</Text>
      {latest.premium && (
        <Text style={styles.premiumBadge}>프리미엄 캐릭터 ✨</Text>
      )}

      {latest.premium && (
        <View style={styles.rerollBox}>
          <Text style={styles.rerollText}>결과가 마음에 안 들면 광고 시청 후 다시 뽑기</Text>
          {rerolling ? (
            <ActivityIndicator size="small" />
          ) : (
            <Button title="다시 뽑기 (광고)" onPress={async () => {
              try {
                setRerolling(true);
                await new Promise((res) => setTimeout(res, 1500)); // 광고 스텁
                const deviceId = await getDeviceId();
                const character = await generateCharacter(latest.parts, { premium: true, deviceId });
                await replaceLatest(character, latest.parts, deviceId);
                Alert.alert("완료", "새로운 프리미엄 결과가 나왔어요!");
              } catch (err: any) {
                console.warn(err);
                Alert.alert("실패", err?.message || "다시 뽑기에 실패했어요.");
              } finally {
                setRerolling(false);
              }
            }} />
          )}
        </View>
      )}

      <Button title="한 번 더 뽑기" onPress={() => navigation.navigate("Home")} />
      <View style={{ height: 10 }} />
      <Button title="도감 보기" onPress={() => navigation.navigate("Collection")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16, alignItems: "center" },
  topRow: { alignSelf: "stretch", alignItems: "flex-end", marginBottom: 8 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  parts: { fontSize: 14, color: "#666", marginBottom: 10 },
  image: { width: 260, height: 260, borderRadius: 12, marginBottom: 12, backgroundColor: "#eee" },
  description: { fontSize: 14, lineHeight: 20, textAlign: "center", marginBottom: 8 },
  premiumBadge: { fontSize: 14, color: "#e67e22", marginBottom: 16 },
  rerollBox: { marginVertical: 12, padding: 12, borderRadius: 10, backgroundColor: "#fff7e6", width: "100%" },
  rerollText: { fontSize: 12, color: "#b36b00", marginBottom: 8 },
});
