import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useWorldStore } from '../stores/worldStore';

export default function AppHub() {
  const [worldPickerOpen, setWorldPickerOpen] = useState(false);
  const worlds = useWorldStore((state) => state.worlds);
  const activeWorldId = useWorldStore((state) => state.activeWorldId);
  const setActiveWorld = useWorldStore((state) => state.setActiveWorld);
  const activeWorld = worlds.find((world) => world.id === activeWorldId) ?? worlds[0];
  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-2 pb-6">
          <Text className="text-white font-black text-3xl tracking-tighter">Social</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => setWorldPickerOpen((open) => !open)} className="bg-[#2A2A2A] flex-row items-center px-3 py-1.5 rounded-full" accessibilityLabel="Choose active world">
              <MaterialCommunityIcons name="google-street-view" size={16} color="#9CA3AF" />
              <Feather name="chevron-down" size={16} color="#9CA3AF" className="ml-1" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/search')} className="bg-[#2A2A2A] p-2.5 rounded-full">
              <Feather name="search" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/settings')} className="bg-[#2A2A2A] p-2.5 rounded-full relative">
              <Ionicons name="settings-sharp" size={18} color="white" />
              {/* Notification Dot */}
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#2A2A2A]" />
            </TouchableOpacity>
          </View>
          {worldPickerOpen && (
            <View className="absolute right-4 top-14 z-20 bg-[#29292F] border border-[#45454D] rounded-2xl p-2 min-w-48">
              {worlds.map((world) => (
                <TouchableOpacity
                  key={world.id}
                  onPress={() => {
                    setActiveWorld(world.id);
                    setWorldPickerOpen(false);
                  }}
                  className={`px-3 py-3 rounded-xl ${world.id === activeWorldId ? 'bg-[#263F68]' : ''}`}
                >
                  <Text className="text-white font-medium">{world.name}</Text>
                  <Text className="text-gray-400 text-xs mt-1">{world.theme}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Banners */}
        <View className="px-4 mb-6 gap-3">
          {/* Referral Banner */}
          <TouchableOpacity onPress={() => router.push('/settings')} className="bg-[#2D2416] border border-yellow-700/30 rounded-2xl p-5 flex-row justify-between items-center">
            <View className="flex-1 pr-4">
              <Text className="text-white font-semibold text-[15px] mb-1.5 leading-5">Get 8 free actions for every friend you refer!</Text>
              <Text className="text-yellow-500 font-medium text-sm">Invite a friend</Text>
            </View>
            <Text className="text-4xl">🧋</Text>
          </TouchableOpacity>

          {/* TikTok Banner */}
          <TouchableOpacity onPress={() => router.push('/store')} className="bg-[#1C1A24] border border-purple-800/30 rounded-2xl p-5 flex-row justify-between items-center relative">
            <TouchableOpacity onPress={() => router.push('/')} className="absolute top-3 left-3 z-10">
              <Feather name="x" size={16} color="#6B7280" />
            </TouchableOpacity>
            <View className="flex-1 pr-4 pl-4">
              <Text className="text-white font-semibold text-[15px] mb-1.5 leading-5">Earn 10 Gems the first time you link a TikTok about Status</Text>
              <Text className="text-purple-400 font-medium text-sm">See how it works</Text>
            </View>
            <Text className="text-4xl">🎬</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Playing */}
        <View className="px-4 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-bold text-lg">Continue playing</Text>
            <TouchableOpacity onPress={() => router.push('/feed')}><Text className="text-blue-400 font-medium text-sm">View all</Text></TouchableOpacity>
          </View>
          
          <View className="bg-[#1C1C1E] rounded-3xl p-5 border border-gray-800">
            {/* World Header */}
            <View className="flex-row justify-between items-center mb-5 bg-[#2A2A2A] self-start px-3 py-1.5 rounded-full w-full">
              <View className="flex-row items-center">
                <Ionicons name="flash" size={14} color="#FBBF24" />
                <Text className="text-white font-bold ml-2 text-sm">{activeWorld?.name ?? 'World'}</Text>
              </View>
              <View className="flex-row items-center">
                <Feather name="sun" size={14} color="#FBBF24" />
                <Text className="text-white font-bold ml-1 text-sm">Day 4</Text>
              </View>
            </View>

            {/* Profile Info */}
            <View className="flex-row items-center mb-4">
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=raghav' }} className="w-12 h-12 rounded-full mr-3 border border-gray-700" />
              <View className="flex-1">
                <Text className="text-white font-bold text-base">Raghav</Text>
                <View className="flex-row items-center mt-0.5">
                  <Image source={{ uri: 'https://i.pravatar.cc/150?u=ginny' }} className="w-4 h-4 rounded-full mr-1" />
                  <Text className="text-gray-400 text-xs">7.3K Followers</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push('/settings')}><Feather name="more-horizontal" size={20} color="#6B7280" /></TouchableOpacity>
            </View>

            <Text className="text-gray-400 text-[14px] mb-5 leading-5">
              Just here for the drama and the magic. I&apos;m friends with everyone FYI.
            </Text>
            
            {/* PLAY BUTTON (Navigates to Tabs) */}
            <TouchableOpacity 
              onPress={() => router.push('/feed')}
              className="bg-[#3B82F6] py-3.5 rounded-2xl items-center shadow-sm shadow-blue-500/20"
            >
              <Text className="text-white font-bold text-base">Play</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Worlds */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center px-4 mb-4">
            <Text className="text-white font-bold text-lg">Featured Worlds</Text>
            <TouchableOpacity onPress={() => router.push('/')}><Text className="text-blue-400 font-medium text-sm">Explore more</Text></TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
            <View className="w-72 mr-4 bg-[#1C1C1E] rounded-3xl overflow-hidden border border-gray-800 pb-4">
              <View className="h-36 bg-red-900 relative">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1000&auto=format&fit=crop' }} 
                  className="w-full h-full opacity-70" 
                />
                <View className="absolute bottom-3 left-3 bg-black/80 px-2 py-1 rounded flex-row items-center">
                  <Feather name="star" size={12} color="#FBBF24" />
                  <Text className="text-white text-xs ml-1 font-bold">Celebrities</Text>
                </View>
              </View>
              <View className="p-4">
                <Text className="text-white font-bold text-lg mb-1">Accidentally Famous</Text>
                <Text className="text-gray-400 text-xs mb-4 leading-4">One video blew up overnight. Now the entire internet knows your name.</Text>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row -space-x-2">
                    {[1,2,3].map(i => <View key={i} className="w-7 h-7 rounded-full bg-gray-600 border-2 border-[#1C1C1E]" />)}
                    <View className="w-7 h-7 rounded-full bg-[#2A2A2A] border-2 border-[#1C1C1E] items-center justify-center">
                      <Text className="text-[10px] text-white font-bold">+4</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="person" size={14} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs ml-1 font-medium">734K</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Floating Create Button */}
      <View className="absolute bottom-10 w-full items-center pointer-events-box-none">
        <TouchableOpacity onPress={() => router.push('/create-world')} className="bg-[#3B82F6] rounded-full px-6 py-4 flex-row items-center">
          <Feather name="plus" size={20} color="white" />
          <Text className="text-white font-bold ml-2 text-base">Create my own world</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}