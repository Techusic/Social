import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAchievementStore } from '../../stores/achievementStore';
import { useEventStore } from '../../stores/eventStore';
import { ACHIEVEMENTS } from '../../types/achievements';
import { getProgression } from '../../utils/progression';

export default function Goals() {
  const unlocked = useAchievementStore((state) => state.unlocked);
  const achievementXp = useAchievementStore((state) => state.totalXp);
  const eventXp = useEventStore((state) => state.progress.xp);
  const completedEvents = useEventStore((state) => state.progress.completedEvents);
  const progression = getProgression(achievementXp + eventXp);
  const unlockedIds = new Set(unlocked.map((achievement) => achievement.id));
  const nextAchievement = ACHIEVEMENTS.find((achievement) => !unlockedIds.has(achievement.id));
  const goalProgress = Math.min(1, (progression.level - 1 + progression.progress) / 10);

  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top']}>
      <ScrollView className="flex-1 px-4">
        <View className="mt-4 mb-7">
          <View className="flex-row items-center justify-between">
            <Text className="text-white font-bold text-xl">Lvl {progression.level}</Text>
            <Text className="text-yellow-500 font-bold text-sm">{progression.currentXp}/{progression.nextLevelXp} XP</Text>
          </View>
          <View className="h-3 bg-[#2A2A2A] rounded-full overflow-hidden mt-3">
            <View className="h-full bg-yellow-500 rounded-full" style={{ width: `${progression.progress * 100}%` }} />
          </View>
        </View>

        <TouchableOpacity className="flex-row items-center mb-6" onPress={() => router.push('/activity-log')}>
          <Text className="text-gray-400 font-medium mr-1">How does this work?</Text>
          <Ionicons name="help-circle" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        <Text className="text-white font-bold text-lg mb-3">Achievements</Text>
        <View className="bg-[#1C1C1E] rounded-2xl p-5 border border-gray-800 mb-8">
          {ACHIEVEMENTS.map((definition) => {
            const achievement = unlocked.find((item) => item.id === definition.id);
            return (
              <View key={definition.id} className="flex-row items-center py-3 border-b border-[#2A2A2A] last:border-b-0">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${achievement ? 'bg-yellow-500/20' : 'bg-[#2A2A2A]'}`}>
                  <Feather name={achievement ? 'award' : 'lock'} size={20} color={achievement ? '#FBBF24' : '#71717A'} />
                </View>
                <View className="flex-1 ml-3">
                  <Text className={achievement ? 'text-white font-semibold' : 'text-gray-400 font-semibold'}>{definition.title}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{definition.description}</Text>
                </View>
                <Text className={achievement ? 'text-yellow-400 text-xs font-bold' : 'text-gray-600 text-xs font-bold'}>
                  {achievement ? `+${definition.rewardXp} XP` : 'Locked'}
                </Text>
              </View>
            );
          })}
        </View>

        <Text className="text-white font-bold text-lg mb-3">Main goal</Text>
        <View className="bg-[#1C1C1E] rounded-2xl p-5 mb-8 border border-gray-800">
          <Text className="text-white font-bold text-lg mb-3">Become Hogwarts Legend</Text>
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-3 bg-[#2A2A2A] rounded-full overflow-hidden mr-3">
              <View className="h-full bg-blue-500 rounded-full" style={{ width: `${goalProgress * 100}%` }} />
            </View>
            <Text className="text-gray-400 font-bold text-xs">{Math.round(goalProgress * 100)}%</Text>
          </View>
          <Text className="text-gray-400 leading-5 mb-5">
            Complete world events and build social momentum through NPC reactions to become a legend in your world.
          </Text>
          <TouchableOpacity onPress={() => router.push('/customize-world')} className="bg-[#3A3A3C] py-3 rounded-xl flex-row justify-center items-center" accessibilityLabel="Customize world">
            <Ionicons name="settings-outline" size={18} color="white" className="mr-2" />
            <Text className="text-white font-bold ml-2">Customize World</Text>
          </TouchableOpacity>
        </View>

        {/* Next Milestone Card */}
        <Text className="text-white font-bold text-lg mb-3">Next Milestone</Text>
        <View className="bg-[#1C1C1E] rounded-2xl p-5 border border-gray-800 mb-20">
          <View className="flex-row justify-between items-start mb-6">
            <Text className="text-white font-medium text-lg flex-1 pr-4">{nextAchievement?.title ?? 'All milestones complete'}</Text>
            <Feather name="star" size={20} color="#6B7280" />
          </View>
          <View className="flex-row justify-between items-center py-4 border-b border-[#2A2A2A]">
            <Text className="text-gray-300">World events completed</Text>
            <Text className="text-orange-400 font-bold text-sm">{completedEvents}</Text>
          </View>
          <View className="flex-row justify-between items-center py-4 mb-4">
            <Text className="text-gray-300">Achievement XP</Text>
            <Text className="text-orange-400 font-bold text-sm">{achievementXp} XP</Text>
          </View>
          <View className="bg-[#2A2A2A] py-4 rounded-xl flex-row justify-center items-center">
            <Feather name={nextAchievement ? 'lock' : 'check-circle'} size={18} color="#9CA3AF" />
            <Text className="text-gray-400 font-bold ml-2 text-base">{nextAchievement ? 'Keep playing to unlock' : 'All rewards unlocked'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Character Button */}
      <TouchableOpacity onPress={() => router.push('/add-character')} className="absolute bottom-6 right-4 bg-blue-400 rounded-full px-6 py-4 shadow-lg shadow-blue-500/30 flex-row items-center border border-blue-300">
        <Feather name="plus" size={18} color="white" />
        <Text className="text-white font-bold ml-2 text-base">Add a new character!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}