import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEventStore } from '../stores/eventStore';

export default function WorldEventScreen() {
  const event = useEventStore((state) => state.events.find((item) => item.id === state.activeEventId));
  const progress = useEventStore((state) => state.progress);
  const resolveEvent = useEventStore((state) => state.resolveEvent);

  if (!event) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close world event"><Feather name="arrow-left" size={28} color="#E5E7EB" /></TouchableOpacity>
          <Text className="text-white text-xl font-bold">World Event</Text>
          <MaterialCommunityIcons name="lightning-bolt" size={25} color="#FBBF24" />
        </View>

        <View className="bg-[#29221A] border border-yellow-700/40 rounded-3xl p-5 mt-4">
          <Text className="text-yellow-400 text-xs font-bold uppercase tracking-widest">{event.category}</Text>
          <Text className="text-white text-2xl font-bold mt-3">{event.title}</Text>
          <Text className="text-gray-200 text-base leading-6 mt-4">{event.prompt}</Text>
          <Text className="text-gray-400 text-sm leading-5 mt-4">{event.context}</Text>
        </View>

        {event.completed ? (
          <View className="bg-[#1C1C1E] rounded-2xl p-5 mt-5 border border-emerald-700/40">
            <Text className="text-emerald-400 font-bold text-base">Event resolved</Text>
            <Text className="text-gray-400 text-sm mt-2">Your choice has been added to the world state.</Text>
          </View>
        ) : (
          <View className="mt-6">
            <Text className="text-white text-lg font-bold mb-3">Choose your response</Text>
            {event.choices.map((choice) => (
              <TouchableOpacity key={choice.id} onPress={() => resolveEvent(event.id, choice.id)} className="bg-[#1C1C1E] border border-gray-800 rounded-2xl p-4 mb-3" accessibilityLabel={choice.label}>
                <Text className="text-white font-bold text-base">{choice.label}</Text>
                <Text className="text-gray-400 text-sm leading-5 mt-2">{choice.description}</Text>
                <Text className="text-blue-400 text-xs mt-3">
                  {choice.consequences.map((delta) => `${delta.amount > 0 ? '+' : ''}${delta.amount} ${delta.stat}`).join('  ·  ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="bg-[#1C1C1E] rounded-2xl p-5 mt-4 border border-gray-800">
          <Text className="text-white font-bold text-base mb-4">Current progression</Text>
          <View className="flex-row flex-wrap gap-3">
            <Text className="text-gray-300 text-sm">😂 Humor {progress.humor}%</Text>
            <Text className="text-gray-300 text-sm">🌟 Aura {progress.aura}%</Text>
            <Text className="text-gray-300 text-sm">♟ Clout {progress.clout}</Text>
            <Text className="text-gray-300 text-sm">XP {progress.xp}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
