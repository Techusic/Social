import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStoryStore } from '../stores/storyStore';

const STORY_DURATION = 7000;

function formatTime(timestamp: number): string {
  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  return minutes < 60 ? `${minutes}m` : `${Math.round(minutes / 60)}h`;
}

export default function Story() {
  const { id, mode } = useLocalSearchParams<{ id?: string; mode?: string }>();
  const stories = useStoryStore((state) => state.stories);
  const commentsByStory = useStoryStore((state) => state.commentsByStory);
  const likedStoryIds = useStoryStore((state) => state.likedStoryIds);
  const addStory = useStoryStore((state) => state.addStory);
  const markViewed = useStoryStore((state) => state.markViewed);
  const addComment = useStoryStore((state) => state.addComment);
  const toggleLike = useStoryStore((state) => state.toggleLike);
  const [draft, setDraft] = useState('');
  const [imageUri, setImageUri] = useState<string>();
  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);

  const startIndex = Math.max(0, stories.findIndex((item) => item.id === id));
  const [storyIndex, setStoryIndex] = useState(startIndex === -1 ? 0 : startIndex);
  const story = stories[storyIndex];
  const comments = story ? commentsByStory[story.id] ?? [] : [];
  const liked = story ? likedStoryIds.includes(story.id) : false;

  useEffect(() => {
    if (mode === 'create' || !story) return;
    markViewed(story.id);
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const nextProgress = Math.min(1, (Date.now() - startedAt) / STORY_DURATION);
      setProgress(nextProgress);
      if (nextProgress >= 1) {
        clearInterval(timer);
        if (storyIndex < stories.length - 1) setStoryIndex((index) => index + 1);
        else router.back();
      }
    }, 80);
    return () => clearInterval(timer);
  }, [markViewed, mode, story, storyIndex, stories.length]);

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

  if (mode === 'create') {
    return (
      <SafeAreaView className="flex-1 bg-[#111113]" edges={['top', 'bottom']}>
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#303035]">
            <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close story composer"><Feather name="x" size={27} color="white" /></TouchableOpacity>
            <Text className="text-white text-xl font-bold">Create story</Text>
            <TouchableOpacity onPress={publish} accessibilityLabel="Publish story"><Text className="text-blue-400 font-bold text-base">Share</Text></TouchableOpacity>
          </View>
          <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingVertical: 24 }} keyboardShouldPersistTaps="handled">
            <Text className="text-gray-400 text-sm mb-3">PREVIEW</Text>
            <View className="rounded-[28px] overflow-hidden bg-[#7C2D56] h-[520px] items-center justify-center">
              {imageUri && <Image source={{ uri: imageUri }} className="absolute w-full h-full" resizeMode="cover" />}
              <View className="absolute w-full h-full bg-black/20" />
              <TextInput value={draft} onChangeText={setDraft} multiline placeholder="Share a thought..." placeholderTextColor="rgba(255,255,255,0.75)" className="text-white text-3xl font-black text-center px-8 w-full" textAlign="center" />
            </View>
            <TouchableOpacity onPress={chooseImage} className="bg-[#29292D] rounded-2xl py-4 mt-5 flex-row items-center justify-center" accessibilityLabel="Add story image">
              <Feather name="image" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Choose a background image</Text>
            </TouchableOpacity>
            <Text className="text-gray-500 text-sm text-center mt-4">Stories disappear from the top of the feed after 24 hours.</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (!story) return null;

  const moveStory = (direction: -1 | 1) => {
    const nextIndex = storyIndex + direction;
    if (nextIndex < 0 || nextIndex >= stories.length) {
      router.back();
      return;
    }
    setShowComments(false);
    setProgress(0);
    setStoryIndex(nextIndex);
  };

  const submitComment = () => {
    if (!draft.trim()) return;
    addComment(story.id, draft);
    setDraft('');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B0B0D]" edges={['top', 'bottom']}>
      <View className="flex-1">
        <View className="absolute inset-0">
          {story.imageUri ? <Image source={{ uri: story.imageUri }} className="w-full h-full" resizeMode="cover" /> : <View className="flex-1 bg-[#7C2D56]" />}
          <View className="absolute inset-0 bg-black/35" />
        </View>

        <View className="px-3 pt-2">
          <View className="flex-row gap-1">
            {stories.map((item, index) => (
              <View key={item.id} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                <View className="h-full bg-white" style={{ width: index < storyIndex ? '100%' : index === storyIndex ? `${progress * 100}%` : '0%' }} />
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row items-center justify-between px-4 pt-4">
          <View className="flex-row items-center flex-1">
            <Image source={{ uri: story.avatar }} className="w-11 h-11 rounded-full mr-3 border-2 border-white/80" />
            <View>
              <View className="flex-row items-center">
                <Text className="text-white font-bold mr-1">{story.authorName}</Text>
                {story.verified && <MaterialIcons name="verified" size={15} color="#60A5FA" />}
              </View>
              <Text className="text-white/70 text-xs mt-1">{story.handle} · now</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close story"><Feather name="x" size={27} color="white" /></TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center px-8">
          <View className="bg-black/35 rounded-2xl px-4 py-3 mb-5">
            <Text className="text-white/80 text-sm text-center">{story.thought}</Text>
          </View>
          <Text className="text-white font-black text-4xl text-center leading-tight">{story.text}</Text>
        </View>

        <View className="px-4 pb-4">
          <View className="flex-row items-center mb-3">
            <Text className="text-white/70 text-xs flex-1">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</Text>
            <TouchableOpacity onPress={() => toggleLike(story.id)} className="w-11 h-11 rounded-full bg-black/35 items-center justify-center mr-2" accessibilityLabel={liked ? 'Unlike story' : 'Like story'}>
              <Feather name="heart" size={22} color={liked ? '#FB7185' : 'white'} fill={liked ? '#FB7185' : 'transparent'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowComments((visible) => !visible)} className="w-11 h-11 rounded-full bg-black/35 items-center justify-center" accessibilityLabel="View story comments">
              <Feather name="message-circle" size={22} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <Image source={{ uri: 'https://i.pravatar.cc/150?u=raghav' }} className="w-10 h-10 rounded-full mr-3" />
            <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={submitComment} returnKeyType="send" placeholder="Reply to story..." placeholderTextColor="rgba(255,255,255,0.7)" className="flex-1 bg-black/45 rounded-full px-4 py-3 border border-white/25 text-white" />
            {draft.trim() && <TouchableOpacity onPress={submitComment} className="ml-3" accessibilityLabel="Send story reply"><Feather name="send" size={22} color="#60A5FA" /></TouchableOpacity>}
          </View>
        </View>

        <View className="absolute left-0 top-20 bottom-28 w-1/3" onTouchEnd={() => moveStory(-1)} />
        <View className="absolute right-0 top-20 bottom-28 w-1/3" onTouchEnd={() => moveStory(1)} />

        {showComments && (
          <View className="absolute left-0 right-0 bottom-0 max-h-[52%] bg-[#17171A] rounded-t-[28px] px-5 pt-4 pb-3">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-bold">Story comments</Text>
              <TouchableOpacity onPress={() => setShowComments(false)} accessibilityLabel="Close story comments"><Feather name="x" size={23} color="#A1A1AA" /></TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {comments.map((comment) => (
                <View key={comment.id} className="flex-row mb-4">
                  <Image source={{ uri: comment.avatar }} className="w-9 h-9 rounded-full mr-3" />
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-white font-semibold">{comment.authorName}</Text>
                      <Text className="text-gray-500 text-xs ml-2">{formatTime(comment.createdAt)}</Text>
                    </View>
                    <Text className="text-gray-300 text-sm leading-5 mt-1">{comment.body}</Text>
                  </View>
                </View>
              ))}
              {comments.length === 0 && <Text className="text-gray-500 text-center py-8">Be the first to comment.</Text>}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
