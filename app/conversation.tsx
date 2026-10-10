import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useMessageStore } from '../stores/messageStore';

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function Conversation() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const conversationId = typeof id === 'string' ? id : 'ginny';
  const conversation = useMessageStore((state) => state.conversations[conversationId]);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const markConversationRead = useMessageStore((state) => state.markConversationRead);
  const [draft, setDraft] = useState('');
  const [bannerVisible, setBannerVisible] = useState(true);
  const [ratedMessages, setRatedMessages] = useState<string[]>([]);

  useEffect(() => {
    markConversationRead(conversationId);
  }, [conversationId, markConversationRead]);

  if (!conversation) return null;

  const submitMessage = () => {
    if (!draft.trim()) return;
    sendMessage(conversation.id, draft);
    setDraft('');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#343438]">
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back to messages"><Feather name="arrow-left" size={32} color="#A1A1AA" /></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: conversation.participantId } })} className="flex-row items-center flex-1 ml-5" accessibilityLabel={`Open ${conversation.participantName} profile`}>
            <Image source={{ uri: conversation.avatar }} className="w-11 h-11 rounded-full mr-3" />
            <Text className="text-white text-base font-semibold">{conversation.participantName}</Text>
            <Feather name="chevron-right" size={22} color="#A1A1AA" className="ml-2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Conversation actions', 'This conversation is stored locally on this device.')} accessibilityLabel="More conversation actions"><Feather name="more-horizontal" size={28} color="#E4E4E7" /></TouchableOpacity>
        </View>

        {bannerVisible && <View className="flex-row items-center bg-[#4C168A] px-6 py-4">
          <MaterialCommunityIcons name="message-star" size={28} color="#D8A6FF" />
          <Text className="text-[#D8A6FF] text-sm ml-4 flex-1">Characters message you first with Status Plus</Text>
          <TouchableOpacity onPress={() => setBannerVisible(false)} accessibilityLabel="Dismiss proactive chat banner"><Feather name="x" size={25} color="#D8A6FF" /></TouchableOpacity>
        </View>}

        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingTop: 18, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
          {conversation.messages.map((message) => (
            <View key={message.id} className={`mb-5 ${message.side === 'player' ? 'items-end' : 'items-start'}`}>
              <View className={`${message.side === 'player' ? 'bg-[#4A9AE8] rounded-t-3xl rounded-bl-3xl max-w-[83%]' : 'bg-[#29292D] rounded-t-3xl rounded-br-3xl max-w-[84%]'} px-4 py-4`}>
                <Text className="text-white text-[15px] leading-5">{message.body}</Text>
              </View>
              <View className={`flex-row items-center mt-1 ${message.side === 'player' ? 'justify-end' : ''}`}>
                {message.side === 'character' && <Image source={{ uri: conversation.avatar }} className="w-9 h-9 rounded-full mr-3" />}
                <Text className="text-gray-400 text-sm">{formatTime(message.createdAt)}</Text>
                {message.side === 'player' && <Text className="text-gray-500 text-xs ml-2">{message.delivery === 'read' ? 'Read' : message.delivery}</Text>}
                {message.rate && <TouchableOpacity onPress={() => setRatedMessages((ids) => ids.includes(message.id) ? ids.filter((id) => id !== message.id) : [...ids, message.id])} className="flex-row items-center ml-20" accessibilityLabel="Rate message"><Feather name="star" size={19} color={ratedMessages.includes(message.id) ? '#FBBF24' : '#A1A1AA'} /><Text className="text-gray-400 text-sm ml-1">{ratedMessages.includes(message.id) ? 'Rated' : 'Rate'}</Text></TouchableOpacity>}
              </View>
            </View>
          ))}
          {conversation.isTyping && <Text className="text-gray-500 text-xs mb-3">Ginny is typing...</Text>}
        </ScrollView>

        <View className="border-t border-[#303035] px-5 pt-4 pb-2">
          <View className="flex-row items-center mb-3">
            <Image source={{ uri: conversation.avatar }} className="w-10 h-10 rounded-full mr-3" />
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-base font-semibold">Currently feeling amused</Text>
                <Text className="text-emerald-400 text-lg font-semibold">{conversation.relationshipDelta}</Text>
              </View>
              <Text className="text-gray-500 text-sm">{conversation.mood}</Text>
            </View>
          </View>
          <View className="flex-row items-center bg-[#29292D] border border-[#4B4B53] rounded-3xl px-5 min-h-[68px]">
            <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={submitMessage} returnKeyType="send" placeholder="Message..." placeholderTextColor="#A1A1AA" className="flex-1 text-gray-200 text-[15px]" />
            {draft.trim().length > 0 && <TouchableOpacity onPress={submitMessage} accessibilityLabel="Send message"><Feather name="send" size={22} color="#4A9AE8" /></TouchableOpacity>}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
