
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Button, ActivityIndicator, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCollection } from "../context/CollectionContext";
import { getDeviceId } from "../utils/deviceId";
import { claimCollectionSlots } from "../services/api";
import { BannerAd } from "../components/BannerAd";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Collection">;

export const CollectionScreen: React.FC<Props> = ({ navigation }) => {
  const { collection, slots, refreshSlots } = useCollection();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDeviceId().then(setDeviceId).catch((err) => {
      console.warn(err);
      setError("디바이스 정보를 불러오지 못했어요.");
    });
  }, []);

  const loadSlots = useCallback(async () => {
    if (!deviceId) return;
    try {
      setLoadingSlots(true);
      await refreshSlots(deviceId);
    } catch (err: any) {
      console.warn(err);
      setError("도감 슬롯 정보를 가져오지 못했어요.");
    } finally {
      setLoadingSlots(false);
    }
  }, [deviceId, refreshSlots]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleClaimSlots = async () => {
    if (!deviceId) return;
    try {
      setClaiming(true);
      // 광고 시청 스텁
      await new Promise((res) => setTimeout(res, 1500));
      await claimCollectionSlots(deviceId);
      await refreshSlots(deviceId);
      Alert.alert("완료", "슬롯이 10개 확장되었어요!");
    } catch (err: any) {
      console.warn(err);
      Alert.alert("확장 실패", err?.message || "슬롯 확장에 실패했어요.");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 도감</Text>
      <BannerAd />
      <View style={styles.slotBar}>
        {loadingSlots ? (
          <ActivityIndicator size="small" />
        ) : (
          <Text style={styles.slotText}>
            슬롯: {slots ? `${slots.used}/${slots.maxSlots}` : "불러오는 중"}
          </Text>
        )}
        <Button title="새로고침" onPress={loadSlots} disabled={loadingSlots || !deviceId} />
      </View>
      {slots && slots.used >= slots.maxSlots && (
        <View style={styles.expandBox}>
          <Text style={styles.expandText}>슬롯이 가득 찼어요. 광고 시청으로 10개 확장!</Text>
          <Button title="슬롯 확장(광고)" onPress={handleClaimSlots} disabled={claiming} />
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={collection}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Result")}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.premium && <Text style={styles.premium}>PREMIUM</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            아직 수집한 캐릭터가 없어요. 뽑으러 가볼까요?
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  slotBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  slotText: { fontSize: 14 },
  expandBox: { backgroundColor: "#fff1cc", padding: 10, borderRadius: 8, marginBottom: 8 },
  expandText: { marginBottom: 6, fontSize: 12, color: "#b36b00" },
  error: { color: "red", marginBottom: 6 },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    alignItems: "center",
    padding: 8
  },
  image: { width: 100, height: 100, borderRadius: 8, marginBottom: 4, backgroundColor: "#ddd" },
  name: { fontSize: 12 },
  premium: { fontSize: 10, color: "#e67e22", marginTop: 2 }
});
