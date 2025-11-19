import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ANIMALS, INSECTS, FRUITS, VEGGIES, OBJECTS, NATURAL, FANTASY, getRandomParts } from "../data/parts";
import { generateCharacter } from "../services/api";
import { useCollection } from "../context/CollectionContext";
import { getDeviceId } from "../utils/deviceId";
import { getAdAccessState, grantAdAccess, hasValidAdAccess } from "../utils/adAccess";
import { BannerAd } from "../components/BannerAd";
import { CategoryKey, DEFAULT_UNLOCK, getUnlockedCounts, incrementUnlock } from "../utils/unlockParts";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "PartsSelection">;

const MIN_PARTS = 2;

export const PartsSelectionScreen: React.FC<Props> = ({ route, navigation }) => {
  const { isPremium } = route.params;
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [adExpiresAt, setAdExpiresAt] = useState<number | null>(null);
  const [adProcessing, setAdProcessing] = useState(false);
  const [adToken, setAdToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<Record<CategoryKey, number> | null>(null);
  const [unlockingCat, setUnlockingCat] = useState<CategoryKey | null>(null);
  const { addCharacter } = useCollection();

  const totals: Record<CategoryKey, number> = useMemo(
    () => ({
      ANIMALS: ANIMALS.length,
      INSECTS: INSECTS.length,
      FRUITS: FRUITS.length,
      VEGGIES: VEGGIES.length,
      OBJECTS: OBJECTS.length,
      NATURAL: NATURAL.length,
      FANTASY: FANTASY.length,
    }),
    []
  );

  const maxParts = hasValidAdAccess(adExpiresAt) ? 3 : 2;
  const canSubmit = selected.length >= MIN_PARTS && selected.length <= maxParts;

  const togglePart = (part: string) => {
    setSelected((prev) => {
      if (prev.includes(part)) {
        return prev.filter((p) => p !== part);
      }
      if (prev.length >= maxParts) {
        if (!hasValidAdAccess(adExpiresAt) && maxParts === 2) {
          promptWatchAd();
        }
        return prev;
      }
      return [...prev, part];
    });
  };

  const handleRandomFill = () => {
    const random = getRandomParts(maxParts);
    setSelected(random.slice(0, maxParts));
  };

  const selectedText = useMemo(() => selected.join(" + "), [selected]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("선택 필요", "파츠를 2개 이상 3개 이하로 선택해주세요.");
      return;
    }
    try {
      setLoading(true);
      const id = deviceId ?? (await getDeviceId());
      setDeviceId(id);
      const character = await generateCharacter(selected, { premium: isPremium, deviceId: id, adToken: adToken ?? undefined });
      await addCharacter(character, selected, id);
      navigation.navigate("Result");
    } catch (err: any) {
      console.warn(err);
      Alert.alert("생성 실패", err?.message || "캐릭터 생성 중 문제가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const promptWatchAd = () => {
    Alert.alert(
      "광고 시청 필요",
      "3개 조합은 광고 시청 후 1시간 동안 가능해요. 광고를 볼까요?",
      [
        { text: "취소", style: "cancel" },
        { text: "보기", onPress: () => handleWatchAd() },
      ]
    );
  };

  const handleWatchAd = async () => {
    try {
      setAdProcessing(true);
      // 실제 광고 SDK 연동 전까지는 간단한 딜레이로 대체
      await new Promise((res) => setTimeout(res, 1500));
      const state = await grantAdAccess();
      setAdExpiresAt(state.expiresAt);
      setAdToken(state.adToken);
      Alert.alert("완료", "1시간 동안 3개 조합이 가능해요!");
    } catch (err) {
      console.warn(err);
      Alert.alert("광고 처리 실패", "광고 시청 정보를 저장하지 못했어요.");
    } finally {
      setAdProcessing(false);
    }
  };

  useEffect(() => {
    getAdAccessState().then((state) => {
      setAdExpiresAt(state.expiresAt);
      setAdToken(state.adToken);
    });
  }, []);

  useEffect(() => {
    getDeviceId()
      .then((id) => {
        setDeviceId(id);
        return getUnlockedCounts(id, totals);
      })
      .then(setUnlocked)
      .catch((err) => {
        console.warn(err);
        setUnlocked(null);
      });
  }, [totals]);

  useEffect(() => {
    if (!hasValidAdAccess(adExpiresAt)) {
      setSelected((prev) => prev.slice(0, 2));
    }
  }, [adExpiresAt]);

  const categories = useMemo(
    () => [
      { title: "동물", data: ANIMALS, key: "ANIMALS" as CategoryKey },
      { title: "곤충/소형", data: INSECTS, key: "INSECTS" as CategoryKey },
      { title: "과일", data: FRUITS, key: "FRUITS" as CategoryKey },
      { title: "야채/식물", data: VEGGIES, key: "VEGGIES" as CategoryKey },
      { title: "사물/도구", data: OBJECTS, key: "OBJECTS" as CategoryKey },
      { title: "자연/기상", data: NATURAL, key: "NATURAL" as CategoryKey },
      { title: "판타지/마스코트", data: FANTASY, key: "FANTASY" as CategoryKey },
    ],
    []
  );

  const handleUnlockMore = async (category: CategoryKey) => {
    if (!deviceId) return;
    try {
      setUnlockingCat(category);
      // 광고 시청 스텁
      await new Promise((res) => setTimeout(res, 1500));
      const updated = await incrementUnlock(deviceId, category, totals);
      setUnlocked(updated);
      Alert.alert("확장 완료", "추가 파츠가 열렸어요!");
    } catch (err) {
      console.warn(err);
      Alert.alert("확장 실패", "추가 파츠를 여는 데 실패했어요.");
    } finally {
      setUnlockingCat(null);
    }
  };

  const getVisibleParts = (key: CategoryKey, data: string[]) => {
    const limit = unlocked?.[key] ?? DEFAULT_UNLOCK;
    return data.slice(0, limit);
  };

  return (
    <View style={styles.container}>
      <BannerAd />
      <Text style={styles.title}>파츠를 골라봐요</Text>
      <Text style={styles.subtitle}>최소 {MIN_PARTS}개, 최대 {maxParts}개까지 선택</Text>
      <Text style={styles.premium}>{isPremium ? "프리미엄 모드" : "무료 모드"}</Text>

      <View style={styles.adBox}>
        <Text style={styles.adTitle}>3개 조합</Text>
        {hasValidAdAccess(adExpiresAt) ? (
          <Text style={styles.adDesc}>
            광고 시청 완료! 만료: {new Date(adExpiresAt!).toLocaleTimeString()}
          </Text>
        ) : (
          <Text style={styles.adDesc}>광고 시청 후 1시간 동안 3개 조합 가능</Text>
        )}
        <View style={styles.adButtons}>
          <Button title="광고 보기" onPress={handleWatchAd} disabled={adProcessing} />
          {adProcessing && <ActivityIndicator size="small" style={{ marginLeft: 8 }} />}
        </View>
      </View>

      <View style={styles.selectedBox}>
        <Text style={styles.selectedLabel}>선택됨</Text>
        <Text style={styles.selectedText}>{selectedText || "아직 없음"}</Text>
      </View>

      <View style={styles.randomRow}>
        <Button title="랜덤 선택" onPress={handleRandomFill} />
        <View style={{ width: 12 }} />
        <Button title="초기화" onPress={() => setSelected([])} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {categories.map((cat) => (
          <View key={cat.title} style={styles.category}>
            <Text style={styles.categoryTitle}>{cat.title}</Text>
            <View style={styles.chipRow}>
              {getVisibleParts(cat.key, cat.data).map((part) => {
                const active = selected.includes(part);
                return (
                  <TouchableOpacity
                    key={part}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => togglePart(part)}
                  >
                    <Text style={active ? styles.chipTextActive : styles.chipText}>{part}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {unlocked && unlocked[cat.key] < cat.data.length && (
              <View style={styles.moreRow}>
                <Text style={styles.moreText}>
                  {unlocked[cat.key]}/{cat.data.length} 공개됨
                </Text>
                <Button
                  title={unlockingCat === cat.key ? "열는 중..." : "더보기 (광고)"}
                  onPress={() => handleUnlockMore(cat.key)}
                  disabled={!!unlockingCat}
                />
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <Button title="뒤로가기" onPress={() => navigation.goBack()} />
            <View style={{ width: 12 }} />
            <Button title="이 조합으로 뽑기" onPress={handleSubmit} disabled={!canSubmit} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 4 },
  premium: { fontSize: 12, color: "#e67e22", marginBottom: 12 },
  selectedBox: {
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 12
  },
  selectedLabel: { fontSize: 12, color: "#777", marginBottom: 4 },
  selectedText: { fontSize: 14 },
  randomRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  adBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa"
  },
  adTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  adDesc: { fontSize: 12, color: "#666" },
  adButtons: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  list: { paddingBottom: 24 },
  category: { marginBottom: 12 },
  categoryTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff"
  },
  chipActive: {
    backgroundColor: "#4a90e2",
    borderColor: "#4a90e2"
  },
  chipText: { color: "#333" },
  chipTextActive: { color: "#fff" },
  moreRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  moreText: { fontSize: 12, color: "#666" },
  footer: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: 8 }
});
