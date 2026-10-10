import { View, Text, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Notifications() {
  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top']}>
      <View className="px-4 py-3 border-b border-gray-900">
        <Text className="text-white text-2xl font-bold">Notifications</Text>
      </View>
      <ScrollView>
        {[1,2,3,4].map((_, i) => (
          <View key={i} className="flex-row px-4 py-4 border-b border-gray-900 bg-[#0A0A0A]">
            <MaterialCommunityIcons name="reply" size={24} color="#3B82F6" className="mr-3 mt-1" />
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Image source={{ uri: 'https://i.pravatar.cc/150?u=ginny' }} className="w-8 h-8 rounded-full mr-2" />
                <View className="bg-gray-800 rounded-full w-8 h-8 items-center justify-center"><Text className="text-gray-400 text-xs">+5</Text></View>
              </View>
              <Text className="text-gray-200 text-[15px] leading-5 mb-2">
                <Text className="font-bold">Ginny Weasley</Text>, seeker_soul, bludger_brain and 3 others replied to you <Text className="text-gray-500">· Day {4-i}</Text>
              </Text>
              <Text className="text-gray-400 text-sm">
                <Text className="text-blue-400">firebolt_fanatic:</Text> anyway if that watch is actually gold then forget the room. i want t...
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}