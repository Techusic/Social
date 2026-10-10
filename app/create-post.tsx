import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFeedStore } from '../stores/feedStore';

const suggestions = [
  '@thebestweasley if you are still rotting in history of magic can come rescue you with some snacks and actual conversation',
  'Looking at my Selfie suddenly feel bad thought I was a person being overrated',
];

export default function CreatePost() {
  const [draft, setDraft] = useState('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const publishPost = useFeedStore((state) => state.publishPost);

  const chooseMedia = async (source: 'library' | 'camera') => {
    const permission = source === 'library'
      ? await ImagePicker.requestMediaLibraryPermissionsAsync()
      : await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', `Allow access to your ${source === 'library' ? 'photo library' : 'camera'} to attach media.`);
      return;
    }

    const result = source === 'library'
      ? await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 3], quality: 1 })
      : await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) setMediaUri(result.assets[0].uri);
  };

  const publish = () => {
    const content = draft.trim();
    if (!content) return;
    publishPost({
      content,
      media: mediaUri ? [{ id: `media-${Date.now()}`, uri: mediaUri, type: 'image' }] : undefined,
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close post composer"><Feather name="x" size={26} color="#E5E7EB" /></TouchableOpacity>
            <TouchableOpacity className="border border-dashed border-gray-600 rounded-full px-5 py-2.5"><Text className="text-gray-300 text-base">＋ Add a Power-up</Text></TouchableOpacity>
            <TouchableOpacity onPress={publish} disabled={!draft.trim()} className={`rounded-full px-6 py-3 ${draft.trim() ? 'bg-[#686873]' : 'bg-[#55555F]'}`}><Text className="text-gray-200 font-semibold">Post</Text></TouchableOpacity>
          </View>

          <View className="px-5 mb-6">
            <View className="flex-row items-center mb-4"><Feather name="book-open" size={18} color="#A1A1AA" /><Text className="text-gray-300 text-lg ml-2">Side Quest</Text></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
              <View className="w-[414px] bg-[#29282E] border border-[#45444D] rounded-2xl px-5 py-4 mr-3"><Text className="text-gray-200 text-base leading-6">Post a vague comment about a Slytherin prefect&apos;s questionable fashion choices. <Text className="text-yellow-400 font-bold">+7 XP</Text></Text></View>
              <View className="w-[300px] bg-[#29282E] border border-[#45444D] rounded-2xl px-5 py-4"><Text className="text-gray-200 text-base leading-6">Imply that you actually quite like the attention.</Text></View>
            </ScrollView>
          </View>

          <View className="border-t border-[#303035] px-7 pt-6">
            <View className="flex-row items-center mb-4">
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=raghav' }} className="w-14 h-14 rounded-full mr-4" />
              <View><Text className="text-white font-bold text-xl">Raghav</Text><Text className="text-gray-400 text-base">@raghav</Text></View>
            </View>
            <TextInput value={draft} onChangeText={setDraft} autoFocus multiline maxLength={280} placeholder="What&apos;s on your mind?" placeholderTextColor="#A1A1AA" className="text-gray-200 text-xl min-h-28" textAlignVertical="top" />
            {mediaUri && <View className="relative mb-4"><Image source={{ uri: mediaUri }} className="w-full h-48 rounded-2xl" /><TouchableOpacity onPress={() => setMediaUri(null)} className="absolute top-2 right-2 bg-black/70 rounded-full p-2"><Feather name="x" size={16} color="white" /></TouchableOpacity></View>}
            <View className="flex-row items-center gap-3 pb-5 border-b border-[#303035]">
              <TouchableOpacity onPress={() => chooseMedia('library')} className="bg-[#25252B] rounded-xl p-3" accessibilityLabel="Choose image"><Ionicons name="images-outline" size={25} color="#D4D4D8" /></TouchableOpacity>
              <TouchableOpacity onPress={() => chooseMedia('camera')} className="bg-[#25252B] rounded-xl p-3" accessibilityLabel="Take photo"><Ionicons name="camera-outline" size={25} color="#D4D4D8" /></TouchableOpacity>
            </View>
          </View>

          <View className="px-7 pt-6">
            <View className="flex-row justify-between items-center mb-5"><View className="flex-row items-center"><Feather name="sun" size={20} color="#A1A1AA" /><Text className="text-gray-300 text-lg ml-2">Suggestions</Text></View><Feather name="chevron-up" size={22} color="#A1A1AA" /></View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
              {suggestions.map((suggestion) => <TouchableOpacity key={suggestion} onPress={() => setDraft(suggestion)} className="w-[355px] border border-dashed border-gray-600 rounded-2xl p-5 mr-3"><Text className="text-gray-300 text-base leading-6">{suggestion}</Text></TouchableOpacity>)}
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
