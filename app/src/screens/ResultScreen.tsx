
import React from "react";
import { View, Text, Image, Button, StyleSheet, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCollection } from "../context/CollectionContext";
import { useSoundSetting } from "../context/SoundContext";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;

export const ResultScreen: React.FC<Props> = ({ navigation }) => {
  const { collection } = useCollection();
  const { muted, toggleMuted } = useSoundSetting();
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
});
