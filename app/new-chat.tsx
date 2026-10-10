import { useMemo, useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { npcProfiles } from '../stores/feedStore';
import { useMessageStore } from '../stores/messageStore';
import { canChatWith } from '../utils/profileLinks';

export default function NewChat() {
  const [query, setQuery] = useState('');
  const startConversation = useMessageStore((state) => state.startConversation);
  const conversations = useMessageStore((state) => state.conversations);
  const filteredProfiles = useMemo(
    () => npcProfiles.filter((profile) => canChatWith(profile.id) && `${profile.name} ${profile.handle}`.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  const openChat = (profile: (typeof npcProfiles)[number]) => {
    startConversation(profile);
    router.push({ pathname: '/conversation', params: { id: profile.id } });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top', 'bottom']}>
      <View className="flex-row items-center px-5 py-4 border-b border-[#343438]">
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back to messages">
          <Feather name="arrow-left" size={30} color="#E4E4E7" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-semibold ml-5">New chat</Text>
      </View>

      <View className="px-5 pt-5">
        <View className="bg-[#29292D] border border-[#4B4B53] flex-row items-center px-4 rounded-2xl">
          <Feather name="search" size={22} color="#A1A1AA" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search characters"
            placeholderTextColor="#A1A1AA"
            className="flex-1 text-gray-200 text-base ml-3 py-4"
            autoFocus
          />
        </View>
        <View className="flex-row items-center mt-6 mb-3">
          <MaterialCommunityIcons name="message-star" size={19} color="#A855F7" />
          <Text className="text-gray-300 font-semibold text-base ml-2">Start a conversation</Text>
        </View>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {filteredProfiles.map((profile) => {
          const conversation = conversations[profile.id];
          const lastMessage = conversation?.messages.at(-1);
          return (
            <TouchableOpacity
              key={profile.id}
              onPress={() => openChat(profile)}
              className="flex-row items-center py-4 border-b border-[#303035]"
              accessibilityLabel={`Start chat with ${profile.name}`}
            >
              <Image source={{ uri: profile.avatar }} className="w-14 h-14 rounded-full mr-4" />
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-white text-base font-semibold">{profile.name}</Text>
                  {profile.verified && <MaterialIcons name="verified" size={14} color="#3B82F6" className="ml-1" />}
                </View>
                <Text className="text-gray-500 text-sm mt-1">{profile.handle}</Text>
                <Text className="text-gray-400 text-sm mt-1" numberOfLines={1}>
                  {lastMessage?.body ?? 'Start a new conversation'}
                </Text>
              </View>
              <Feather name="chevron-right" size={22} color="#71717A" />
            </TouchableOpacity>
          );
        })}
        {filteredProfiles.length === 0 && (
          <View className="items-center pt-20 px-8">
            <Feather name="search" size={42} color="#71717A" />
            <Text className="text-gray-400 text-base text-center mt-4">No characters found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
