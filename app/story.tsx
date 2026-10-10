import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Story() {
  return (
    <SafeAreaView className="flex-1 bg-[#B91C1C]" edges={['top', 'bottom']}>
      {/* Top Progress Bar */}
      <View className="flex-row px-2 pt-2 gap-1 mb-2">
        <View className="h-1 bg-white flex-1 rounded-full" />
        <View className="h-1 bg-white/30 flex-1 rounded-full" />
        <View className="h-1 bg-white/30 flex-1 rounded-full" />
      </View>

      {/* Header Info */}
      <View className="flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=ginny' }} className="w-10 h-10 rounded-full mr-2 border border-white/20" />
          <View>
            <View className="flex-row items-center">
              <Text className="text-white font-bold mr-1">Ginny Weasley</Text>
              <MaterialIcons name="verified" size={14} color="#3B82F6" />
            </View>
            <Text className="text-white/70 text-xs">@thebestweasley</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="bg-green-500 px-3 py-1.5 rounded-full flex-row items-center border border-black/20">
            <MaterialIcons name="star" size={14} color="white" />
            <Feather name="chevron-down" size={14} color="white" className="ml-1" />
          </View>
          <Feather name="star" size={20} color="white" />
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Internal Thought Bubble */}
      <View className="bg-black/60 self-start ml-4 mt-3 px-4 py-2.5 rounded-full">
        <Text className="text-white text-sm">He's actually becoming the main character of...</Text>
      </View>

      {/* Core Content */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-white font-black text-4xl text-center">i failed my charms essay</Text>
      </View>

      {/* Comments Overlay */}
      <View className="px-4 pb-4">
        <View className="flex-row mb-3">
          <View className="w-8 h-8 rounded-full bg-pink-500 items-center justify-center mr-2 z-10"><Text className="text-white font-bold text-xs">W</Text></View>
          <View className="flex-1">
            <Text className="text-white/80 text-xs mb-0.5"><Text className="font-bold text-white">wand_and_wing</Text> @wand_and_wing</Text>
            <Text className="text-white text-sm">rip ginny's academic career but we all know she is too scary for flitwick to actually fail</Text>
          </View>
        </View>
        <View className="flex-row items-center pl-2 mb-4">
          <View className="w-5 h-5 rounded-full bg-blue-500 border border-[#B91C1C] z-20" />
          <View className="w-5 h-5 rounded-full bg-purple-500 border border-[#B91C1C] -ml-2 z-10" />
          <Text className="text-white/80 text-sm ml-2">View other 5 comments</Text>
        </View>

        {/* Input Bar */}
        <View className="flex-row items-center">
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=raghav' }} className="w-10 h-10 rounded-full mr-3" />
          <View className="flex-1 bg-black/40 rounded-full px-4 py-3 border border-white/20">
            <TextInput placeholder="Add a comment..." placeholderTextColor="rgba(255,255,255,0.7)" className="text-white" />
          </View>
          <Feather name="heart" size={24} color="white" className="ml-4" />
        </View>
      </View>
    </SafeAreaView>
  );
}