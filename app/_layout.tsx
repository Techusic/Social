import "../global.css";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { npcProfiles, useFeedStore } from "../stores/feedStore";

export default function RootLayout() {
  useEffect(() => {
    const simulateAllNpcs = () => {
      npcProfiles.forEach(() => useFeedStore.getState().simulateNpcTick());
    };
    simulateAllNpcs();
    const interval = setInterval(simulateAllNpcs, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}