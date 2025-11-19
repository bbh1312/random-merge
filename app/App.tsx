
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ResultScreen } from "./src/screens/ResultScreen";
import { CollectionScreen } from "./src/screens/CollectionScreen";
import { PartsSelectionScreen } from "./src/screens/PartsSelectionScreen";
import { CollectionProvider } from "./src/context/CollectionContext";
import { SoundProvider } from "./src/context/SoundContext";

export type RootStackParamList = {
  Home: undefined;
  Result: undefined;
  Collection: undefined;
  PartsSelection: { isPremium: boolean };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SoundProvider>
      <CollectionProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: "랜덤 합성" }} />
            <Stack.Screen name="PartsSelection" component={PartsSelectionScreen} options={{ title: "파츠 선택" }} />
            <Stack.Screen name="Result" component={ResultScreen} options={{ title: "새 친구 탄생!" }} />
            <Stack.Screen name="Collection" component={CollectionScreen} options={{ title: "도감" }} />
          </Stack.Navigator>
        </NavigationContainer>
      </CollectionProvider>
    </SoundProvider>
  );
}
