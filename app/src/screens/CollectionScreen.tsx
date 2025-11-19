
import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCollection } from "../context/CollectionContext";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Collection">;

export const CollectionScreen: React.FC<Props> = ({ navigation }) => {
  const { collection } = useCollection();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 도감</Text>
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
