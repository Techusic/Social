import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useStoryStore } from '../stores/storyStore';

export default function Story() {
  const { id, mode } = useLocalSearchParams<{ id?: string; mode?: string }>();
  const stories = useStoryStore((state) => state.stories);
  const addStory = useStoryStore((state) => state.addStory);
  const markViewed = useStoryStore((state) => state.markViewed);
  const story = stories.find((item) => item.id === id) ?? stories[0];
  const [draft, setDraft] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const storyId = story?.id;

  useEffect(() => {
    if (mode !== 'create' && storyId) markViewed(storyId);
  }, [markViewed, mode, storyId]);

  if (mode === 'create') {
    const chooseImage = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Allow photo access to add an image to your story.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [9, 16], quality: 1 });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    const publish = () => {
      const text = draft.trim();
      if (!text && !imageUri) {
        Alert.alert('Add something first', 'Write a thought or choose an image for your story.');
        return;
      }
      addStory({
        authorId: 'player',
        authorName: 'Raghav',
        handle: '@raghav',
        avatar: 'https://i.pravatar.cc/150?u=raghav',
        thought: 'A new update from your world.',
        text: text || 'New story',
        imageUri,
      });
      router.back();
    };

    return (
      <SafeAreaView className="flex-1 bg-[#19191B]">
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#303035]">
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close story composer"><Feather name="x" size={26} color="white" /></TouchableOpacity>
            <Text className="text-white text-xl font-bold">Add to your story</Text>
            <TouchableOpacity onPress={publish} accessibilityLabel="Publish story"><Text className="text-blue-400 font-bold text-base">Share</Text></TouchableOpacity>
          </View>
          <View className="flex-1 px-5 pt-8">
            <View className="rounded-3xl overflow-hidden bg-[#B91C1C] min-h-[420px] items-center justify-center">
              {imageUri && <Image source={{ uri: imageUri }} className="absolute w-full h-full" resizeMode="cover" />}
              <TextInput value={draft} onChangeText={setDraft} multiline placeholder="Share a thought..." placeholderTextColor="rgba(255,255,255,0.7)" className="text-white text-3xl font-bold text-center px-8 w-full" />
            </View>
            <TouchableOpacity onPress={chooseImage} className="bg-[#29292D] rounded-full py-4 mt-6 flex-row items-center justify-center" accessibilityLabel="Add story image">
              <Feather name="image" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Add an image</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (!story) return null;
  return (
    <SafeAreaView className="flex-1 bg-[#B91C1C]">
      <View className="flex-row px-2 pt-2 gap-1 mb-2"><View className="h-1 bg-white flex-1 rounded-full" /></View>
      <View className="flex-row items-center justify-between px-4">
        <View className="flex-row items-center">
          <Image source={{ uri: story.avatar }} className="w-10 h-10 rounded-full mr-2 border border-white/20" />
          <View>
            <View className="flex-row items-center"><Text className="text-white font-bold mr-1">{story.authorName}</Text>{story.verified && <MaterialIcons name="verified" size={14} color="#3B82F6" />}</View>
            <Text className="text-white/70 text-xs">{story.handle}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close story"><Feather name="x" size={24} color="white" /></TouchableOpacity>
      </View>
      <View className="bg-black/60 self-start ml-4 mt-3 px-4 py-2.5 rounded-full"><Text className="text-white text-sm">{story.thought}</Text></View>
      <View className="flex-1 items-center justify-center px-6">
        {story.imageUri && <Image source={{ uri: story.imageUri }} className="absolute w-full h-full" resizeMode="cover" />}
        <Text className="text-white font-black text-4xl text-center">{story.text}</Text>
      </View>
      <View className="px-4 pb-5">
        <View className="flex-row items-center">
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=raghav' }} className="w-10 h-10 rounded-full mr-3" />
          <TextInput placeholder="Reply to story..." placeholderTextColor="rgba(255,255,255,0.7)" className="flex-1 bg-black/40 rounded-full px-4 py-3 border border-white/20 text-white" />
          <Feather name="heart" size={24} color="white" className="ml-4" />
        </View>
      </View>
    </SafeAreaView>
  );
}
