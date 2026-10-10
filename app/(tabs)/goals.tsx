import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Goals() {
  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top']}>
      <ScrollView className="flex-1 px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View className="flex-row items-center">
            <Text className="text-white font-bold text-xl mr-2">Lvl 7</Text>
            <View className="w-16 h-4 bg-[#2A2A2A] rounded-md overflow-hidden mr-2">
              <View className="w-1/3 h-full bg-yellow-500" />
            </View>
            <Text className="text-yellow-500 font-bold text-sm mr-2">12/35 XP</Text>
            <TouchableOpacity className="bg-yellow-600 rounded p-1">
              <Feather name="plus" size={14} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="bg-[#2A2A2A] p-2 rounded-xl"><MaterialCommunityIcons name="book-open-variant" size={20} color="#9CA3AF" /></TouchableOpacity>
            <TouchableOpacity className="bg-[#2A2A2A] p-2 rounded-xl"><MaterialCommunityIcons name="storefront" size={20} color="#9CA3AF" /></TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity className="flex-row items-center mb-6">
          <Text className="text-gray-400 font-medium mr-1">How does this work?</Text>
          <Ionicons name="help-circle" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Main Goal Card */}
        <Text className="text-white font-bold text-lg mb-3">Main goal</Text>
        <View className="bg-[#1C1C1E] rounded-2xl p-5 mb-8 border border-gray-800">
          <Text className="text-white font-bold text-lg mb-3">Become Hogwarts Legend</Text>
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-3 bg-[#2A2A2A] rounded-full overflow-hidden mr-3">
              <View className="w-[3%] h-full bg-blue-500 rounded-full" />
            </View>
            <Text className="text-gray-400 font-bold text-xs">3%</Text>
          </View>
          <Text className="text-gray-400 leading-5 mb-5">
            Life at Hogwarts plays out through the school feed — news accounts are posting breaking stories, students are gossiping about Quidditch drama and...
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
            <Text className="text-white font-medium text-lg flex-1 pr-4">Get your name whispered in the Slytherin common room</Text>
            <Feather name="star" size={20} color="#6B7280" />
          </View>
          <View className="flex-row justify-between items-center py-4 border-b border-[#2A2A2A]">
            <Text className="text-gray-300">Reputation</Text>
            <Text className="text-orange-400 font-bold text-sm">📌 +1 Needed</Text>
          </View>
          <View className="flex-row justify-between items-center py-4 mb-4">
            <Text className="text-gray-300">Social Savvy</Text>
            <Text className="text-orange-400 font-bold text-sm">📌 +2 Needed</Text>
          </View>
          <TouchableOpacity className="bg-blue-500 py-4 rounded-xl flex-row justify-center items-center">
            <Feather name="check-circle" size={18} color="white" />
            <Text className="text-white font-bold ml-2 text-base">Claim Reward</Text>
          </TouchableOpacity>
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