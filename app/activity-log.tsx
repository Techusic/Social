import { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useActivityLogStore } from '../stores/activityLogStore';

const eventStyles = {
  world: { icon: 'globe' as const, color: '#A78BFA', label: 'World' },
  social: { icon: 'activity' as const, color: '#4B9BE8', label: 'Social' },
  chat: { icon: 'message-circle' as const, color: '#F59E0B', label: 'Messages' },
  event: { icon: 'zap' as const, color: '#F472B6', label: 'Event' },
  activity: { icon: 'calendar' as const, color: '#34D399', label: 'Activity' },
};

function formatTime(timestamp: number): string {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return `${Math.round(minutes / 1440)}d ago`;
}

export default function ActivityLog() {
  const entries = useActivityLogStore((state) => state.entries);
  const clear = useActivityLogStore((state) => state.clear);
  const sections = useMemo(() => {
    const grouped = new Map<string, typeof entries>();
    entries.forEach((entry) => {
      const day = new Date(entry.createdAt).toDateString() === new Date().toDateString()
        ? 'Today'
        : new Date(entry.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric' });
      grouped.set(day, [...(grouped.get(day) ?? []), entry]);
    });
    return Array.from(grouped.entries());
  }, [entries]);

  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-10 pt-8 pb-6 border-b border-[#3B3B3F]">
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back">
          <Feather name="arrow-left" size={26} color="#E4E4E7" />
        </TouchableOpacity>
        <Text className="text-[#F1F1F3] text-[30px] font-semibold tracking-tight">Activity Log</Text>
        <TouchableOpacity onPress={clear} accessibilityLabel="Clear activity log">
          <Text className="text-[#8C8C94] text-sm">Clear</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="px-10 pt-6 pb-2">
          <Text className="text-[#A7A7AE] text-[16px] leading-6">Everything you do leaves a mark on your world.</Text>
        </View>
        {sections.map(([day, dayEntries]) => (
          <View key={day} className="px-10 pt-5">
            <Text className="text-[#F1F1F3] text-[18px] font-semibold mb-4">{day}</Text>
            {dayEntries.map((entry, index) => {
              const style = eventStyles[entry.kind];
              return (
                <View key={entry.id} className="flex-row">
                  <View className="w-12 items-center">
                    <View className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: `${style.color}22` }}>
                      <Feather name={style.icon} size={20} color={style.color} />
                    </View>
                    {index < dayEntries.length - 1 && <View className="w-px flex-1 bg-[#37373D] my-1" />}
                  </View>
                  <View className="flex-1 ml-4 pb-6">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-[#F1F1F3] text-[17px] font-semibold flex-1 mr-3">{entry.title}</Text>
                      <Text className="text-[#777780] text-xs">{formatTime(entry.createdAt)}</Text>
                    </View>
                    <Text className="text-[#A7A7AE] text-[15px] leading-5 mt-1">{entry.detail}</Text>
                    <View className="self-start rounded-full px-2.5 py-1 mt-3" style={{ backgroundColor: `${style.color}1A` }}>
                      <Text className="text-xs font-medium" style={{ color: style.color }}>{style.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}
        {entries.length === 0 && (
          <View className="items-center pt-20">
            <MaterialCommunityIcons name="notebook-outline" size={56} color="#71717A" />
            <Text className="text-[#A7A7AE] mt-4">Nothing has happened yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
