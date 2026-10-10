import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Chat() {
  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top']}>
      <View className="px-4 py-3 border-b border-gray-900 flex-row justify-between items-center mb-4">
        <Text className="text-white text-2xl font-bold">Messages</Text>
        <MaterialCommunityIcons name="comment-flash" size={24} color="#A855F7" />
      </View>

      <View className="px-4">
        {/* Proactive Characters Banner (Premium Unlocked) */}
        <View className="bg-purple-900/40 rounded-xl p-4 mb-6 border border-purple-500/30">
          <View className="flex-row items-center mb-1">
            <MaterialCommunityIcons name="crown" size={16} color="#A855F7" />
            <Text className="text-purple-400 font-bold ml-1 text-xs">PROACTIVE CHAT ACTIVE</Text>
          </View>
          <Text className="text-white font-bold text-base mb-1">Characters can initiate messages</Text>
          <Text className="text-gray-400 text-sm">They will text you first based on feed events.</Text>
        </View>

        {/* Chat List */}
        <TouchableOpacity onPress={() => router.push('/conversation')} className="flex-row items-center py-3" accessibilityLabel="Open conversation with Ginny Weasley">
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=ginny' }} className="w-14 h-14 rounded-full mr-4" />
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-white font-bold text-base mr-1">Ginny Weasley</Text>
              <MaterialIcons name="verified" size={14} color="#3B82F6" />
            </View>
            <Text className="text-gray-400 text-sm" numberOfLines={2}>Whatever. Just don&apos;t be late, or I&apos;m using you for target practice with the Bludgers.</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="absolute bottom-6 right-4 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg">
        <Feather name="plus" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}