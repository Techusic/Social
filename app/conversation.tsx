import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type Message = {
  id: string;
  body: string;
  side: 'player' | 'character';
  time: string;
  rate?: boolean;
};

const initialMessages: Message[] = [
  { id: '1', body: 'It wasn’t a prank now was it? I saw you take the locket.', side: 'player', time: '4:00 PM' },
  { id: '2', body: "Don't get cocky just because you weren't lying for once", side: 'character', time: '4:00 PM' },
  { id: '3', body: 'I got it, alright? Now stop hovering over my shoulder like some kind of creep', side: 'character', time: '4:00 PM', rate: true },
  { id: '4', body: 'All right all right see you at practice', side: 'player', time: '4:01 PM' },
  { id: '5', body: 'Whatever', side: 'character', time: '4:01 PM' },
  { id: '6', body: "Just don't be late, or I'm using you for target practice with the Bludgers", side: 'character', time: '4:01 PM', rate: true },
];

export default function Conversation() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');

  const sendMessage = () => {
    const body = draft.trim();
    if (!body) return;
    setMessages((current) => [
      ...current,
      { id: String(Date.now()), body, side: 'player', time: '4:02 PM' },
    ]);
    setDraft('');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#343438]">
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back to messages">
            <Feather name="arrow-left" size={32} color="#A1A1AA" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: 'ginny' } })} className="flex-row items-center flex-1 ml-5" accessibilityLabel="Open Ginny Weasley profile">
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=ginny' }} className="w-11 h-11 rounded-full mr-3" />
            <Text className="text-white text-base font-semibold">Ginny Weasley</Text>
            <Feather name="chevron-right" size={22} color="#A1A1AA" className="ml-2" />
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="More conversation actions">
            <Feather name="more-horizontal" size={28} color="#E4E4E7" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center bg-[#4C168A] px-6 py-4">
          <MaterialCommunityIcons name="message-star" size={28} color="#D8A6FF" />
          <Text className="text-[#D8A6FF] text-sm ml-4 flex-1">Characters message you first with Status Plus</Text>
          <TouchableOpacity accessibilityLabel="Dismiss proactive chat banner">
            <Feather name="x" size={25} color="#D8A6FF" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingTop: 18, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
          {messages.map((message) => (
            <View key={message.id} className={`mb-5 ${message.side === 'player' ? 'items-end' : 'items-start'}`}>
              <View className={`${message.side === 'player' ? 'bg-[#4A9AE8] rounded-t-3xl rounded-bl-3xl max-w-[83%]' : 'bg-[#29292D] rounded-t-3xl rounded-br-3xl max-w-[84%]'} px-4 py-4`}>
                <Text className="text-white text-[15px] leading-5">{message.body}</Text>
              </View>
              <View className={`flex-row items-center mt-1 ${message.side === 'player' ? 'justify-end' : ''}`}>
                {message.side === 'character' && <Image source={{ uri: 'https://i.pravatar.cc/150?u=ginny' }} className="w-9 h-9 rounded-full mr-3" />}
                <Text className="text-gray-400 text-sm">{message.time}</Text>
                {message.rate && <TouchableOpacity className="flex-row items-center ml-20" accessibilityLabel="Rate message"><Feather name="star" size={19} color="#A1A1AA" /><Text className="text-gray-400 text-sm ml-1">Rate</Text></TouchableOpacity>}
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="border-t border-[#303035] px-5 pt-4 pb-2">
          <View className="flex-row items-center mb-3">
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=ginny' }} className="w-10 h-10 rounded-full mr-3" />
            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-base font-semibold">Currently feeling amused</Text>
                <Text className="text-emerald-400 text-lg font-semibold">+0.1%</Text>
              </View>
              <Text className="text-gray-500 text-sm">Smirkingly threatening but less hostile</Text>
            </View>
          </View>
          <View className="flex-row items-center bg-[#29292D] border border-[#4B4B53] rounded-3xl px-5 min-h-[68px]">
            <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={sendMessage} returnKeyType="send" placeholder="Message..." placeholderTextColor="#A1A1AA" className="flex-1 text-gray-200 text-[15px]" />
            {draft.trim().length > 0 && <TouchableOpacity onPress={sendMessage} accessibilityLabel="Send message"><Feather name="send" size={22} color="#4A9AE8" /></TouchableOpacity>}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
