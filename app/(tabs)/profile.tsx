import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useProfileStore } from '../../stores/profileStore';
import { useActivityStore } from '../../stores/activityStore';

function DivergingProgress({ value }: { value: number }) {
  const width = `${Math.min(50, Math.abs(value))}%` as `${number}%`;
  return (
    <View className="h-3 bg-[#2A2A2A] rounded-full overflow-hidden relative">
      {value >= 0 ? (
        <View className="absolute left-1/2 top-0 bottom-0 bg-green-500" style={{ width }} />
      ) : (
        <View className="absolute right-1/2 top-0 bottom-0 bg-red-500" style={{ width }} />
      )}
      <View className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/70" />
    </View>
  );
}

export default function Profile() {
  const profile = useProfileStore();
  const activities = useActivityStore((state) => state.activities);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'activities'>('overview');

  return (
    <View className="flex-1 bg-[#121214]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View className="h-48 relative w-full">
          <Image 
            source={{ uri: profile.coverUri }} 
            className="w-full h-full opacity-90"
          />
          {/* Top Nav Overlay */}
          <View className="absolute top-14 left-0 right-0 px-4 flex-row justify-between items-center">
            <View className="flex-1" />
            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="bg-black/60 p-2.5 rounded-full border border-gray-700">
                <MaterialCommunityIcons name="storefront" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="bg-black/60 p-2.5 rounded-full border border-gray-700">
                <Ionicons name="settings-sharp" size={22} color="#F87171" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="px-4 -mt-12">
          <View className="flex-row justify-between items-end mb-3">
            <View className="w-24 h-24 rounded-full border-4 border-[#121214] bg-gray-800 overflow-hidden">
              <Image source={{ uri: profile.avatarUri }} className="w-full h-full" />
            </View>
            <TouchableOpacity onPress={() => router.push('/edit-profile')} className="bg-[#2A2A2A] px-5 py-2.5 rounded-full mb-2 border border-gray-700">
              <Text className="text-white font-bold">Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-1">
            <Text className="text-white font-bold text-2xl mr-1">{profile.name}</Text>
            <MaterialIcons name="verified" size={20} color="#3B82F6" />
          </View>
          <Text className="text-gray-400 mb-3">{profile.handle}</Text>

          <Text className="text-white text-base mb-4 leading-6">
            {profile.bio}
          </Text>

          <View className="flex-row items-center mb-2">
            <Text className="text-white font-bold text-base">7.3K</Text>
            <Text className="text-gray-400 ml-1">Followers</Text>
            <Text className="text-green-500 font-bold ml-2">+280</Text>
          </View>
          <Text className="text-gray-500 text-sm mb-6">Everyone wants to know what you&apos;re up to next.</Text>

          <View className="gap-3 mb-6">
            <TouchableOpacity className="bg-[#1C1C1E] py-3.5 rounded-xl flex-row justify-center items-center border border-gray-800">
              <Ionicons name="settings-outline" size={18} color="white" />
              <Text className="text-white font-bold ml-2">Customize World</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('activities')} className="bg-[#1C1C1E] py-3.5 rounded-xl flex-row justify-center items-center border border-gray-800">
              <MaterialCommunityIcons name="book-open-variant" size={18} color="white" />
              <Text className="text-white font-bold ml-2">Activity Log</Text>
            </TouchableOpacity>
          </View>

          {/* Sub Tabs */}
          <View className="flex-row border-b border-[#2A2A2A] mb-6">
            {(['overview', 'posts', 'activities'] as const).map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} className={`flex-1 items-center pb-3 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}>
                <Text className={`${activeTab === tab ? 'text-blue-500' : 'text-gray-500'} font-bold`}>{tab[0].toUpperCase() + tab.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'activities' ? (
            <View>
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-white font-bold text-base">Activities</Text>
                <TouchableOpacity onPress={() => router.push('/create-activity')} accessibilityLabel="View all activities">
                  <Text className="text-blue-400 text-sm">View all</Text>
                </TouchableOpacity>
              </View>
              {activities.length === 0 ? (
                <View className="items-center py-10">
                  <MaterialCommunityIcons name="calendar-alert-outline" size={64} color="#71717A" />
                  <Text className="text-gray-400 text-sm mt-5">No roleplay activities with characters planned</Text>
                </View>
              ) : activities.map((activity) => (
                <View key={activity.id} className="bg-[#1C1C1E] border border-gray-800 rounded-2xl p-4 mb-3">
                  <Text className="text-white font-semibold text-base">{activity.title}</Text>
                  <Text className="text-gray-400 text-sm mt-2">Today (Day {activity.day}) · {activity.time}</Text>
                </View>
              ))}
              <TouchableOpacity onPress={() => router.push('/create-activity')} className="bg-blue-500 py-3.5 rounded-full flex-row justify-center items-center mt-2" accessibilityLabel="Create activity">
                <Feather name="plus" size={18} color="white" />
                <Text className="text-white font-semibold ml-2">Create activity</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
          <Text className="text-white font-bold text-base mb-3">Social Media Presence</Text>
          <View className="bg-[#1C1C1E] rounded-2xl p-5 mb-6 border border-gray-800">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-medium">😂 Humor</Text>
              <Text className="text-white font-bold">20.7%</Text>
            </View>
            <View className="w-full h-3 bg-[#2A2A2A] rounded-full mb-6 flex-row">
              <View className="h-full bg-green-500 rounded-l-full" style={{ width: '45%' }} />
              <View className="h-full bg-green-400 rounded-r-full" style={{ width: '10%' }} />
            </View>

            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-medium">🌟 Aura</Text>
              <View className="flex-row items-center">
                <Text className="text-green-500 text-xs mr-2">+2.3%</Text>
                <Text className="text-white font-bold">25.1%</Text>
              </View>
            </View>
            <View className="w-full h-3 bg-[#2A2A2A] rounded-full mb-4 flex-row">
              <View className="h-full bg-green-500 rounded-l-full" style={{ width: '50%' }} />
              <View className="h-full bg-green-400 rounded-r-full" style={{ width: '10%' }} />
            </View>
            <Text className="text-gray-400 text-sm">Turning school-wide suspicion into accidental social prestige.</Text>
          </View>

          <Text className="text-white font-bold text-base mb-3">Relationships (1)</Text>
          <View className="bg-[#1C1C1E] rounded-2xl p-5 mb-10 border border-gray-800">
            <View className="flex-row items-center mb-4">
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=ginny' }} className="w-10 h-10 rounded-full mr-3" />
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-white font-bold mr-1">Ginny Weasley</Text>
                  <MaterialIcons name="verified" size={14} color="#3B82F6" />
                </View>
                <Text className="text-gray-500 text-xs">@thebestweasley</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#6B7280" />
            </View>
            
            <View className="flex-row items-center mb-3">
              <View className="flex-1">
                <DivergingProgress value={3.8} />
              </View>
              <Text className="text-white font-bold text-sm ml-3">3.8%</Text>
            </View>
            <View className="flex-row justify-between items-start">
              <Text className="text-gray-400 text-sm flex-1 pr-4">She respects the sheer chaos of your rising notoriety.</Text>
              <Text className="text-green-500 text-xs font-bold">+1.0%</Text>
            </View>

          </View>
          <TouchableOpacity onPress={() => router.push('/add-character')} className="bg-blue-500 py-3.5 rounded-xl flex-row justify-center items-center mb-10" accessibilityLabel="Add a new character">
            <Feather name="user-plus" size={16} color="white" />
            <Text className="text-white font-bold ml-2">Add a new character!</Text>
          </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}