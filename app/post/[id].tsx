import { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFeedStore } from '../../stores/feedStore';
import type { Reply } from '../../types/feed';

function formatMetric(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

function PostComment({ comment }: { comment: Reply }) {
  return (
    <View className="px-5 py-4 border-b border-[#303035]">
      <View className="flex-row">
        <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: comment.authorId } })} accessibilityLabel={`Open ${comment.authorName} profile`}>
          <Image source={{ uri: comment.avatar }} className="w-10 h-10 rounded-full mr-3" />
        </TouchableOpacity>
        <View className="flex-1">
          <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: comment.authorId } })} className="flex-row items-center" accessibilityLabel={`Open ${comment.authorName} profile`}>
            <Text className="text-white text-base font-bold">{comment.authorName}</Text>
            <Text className="text-gray-500 text-sm ml-2">{comment.authorHandle}</Text>
          </TouchableOpacity>
          <Text className="text-gray-100 text-[15px] leading-5 mt-2">{comment.body}</Text>
          <View className="flex-row items-center mt-4">
            <TouchableOpacity className="flex-row items-center" accessibilityLabel={`Like ${comment.authorName}'s reply`}>
              <Feather name="heart" size={17} color="#8A8A91" />
              <Text className="text-gray-500 text-xs ml-2">{formatMetric(comment.likes)}</Text>
            </TouchableOpacity>
            <Text className="text-gray-600 text-base mx-3">|</Text>
            <TouchableOpacity accessibilityLabel={`Reply to ${comment.authorName}`}>
              <Text className="text-gray-500 text-xs">Reply</Text>
            </TouchableOpacity>
            <View className="flex-1 items-end"><Feather name="star" size={17} color="#8A8A91" /></View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = useFeedStore((state) => state.posts.find((item) => item.id === id));
  const replies = useFeedStore((state) => state.repliesByPost[id ?? ''] ?? []);
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const toggleRepost = useFeedStore((state) => state.toggleRepost);
  const addReply = useFeedStore((state) => state.addReply);
  const [draft, setDraft] = useState('');
  const replyInputRef = useRef<TextInput>(null);

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-[#19191B] items-center justify-center">
        <Text className="text-white text-base mb-4">Post not found</Text>
        <TouchableOpacity onPress={() => router.back()}><Text className="text-blue-400">Go back</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  const sendReply = () => {
    const body = draft.trim();
    if (!body) return;
    addReply(post.id, {
      authorId: 'player',
      authorName: 'Raghav',
      authorHandle: '@raghav',
      avatar: 'https://i.pravatar.cc/150?u=raghav',
      body,
    });
    setDraft('');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between px-5 py-4">
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back to feed"><Feather name="arrow-left" size={28} color="#E4E4E7" /></TouchableOpacity>
          <Text className="text-white text-xl font-semibold">Post</Text>
          <TouchableOpacity accessibilityLabel="More post actions"><Feather name="chevron-up" size={24} color="#E4E4E7" /></TouchableOpacity>
        </View>

        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="px-5 pt-5 pb-5 border-b border-[#303035]">
            <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: post.authorId } })} className="flex-row items-center" accessibilityLabel={`Open ${post.authorName} profile`}>
              <Image source={{ uri: `https://i.pravatar.cc/150?u=${post.authorId}` }} className="w-14 h-14 rounded-full mr-4" />
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-white text-xl font-bold">{post.authorName}</Text>
                  {post.verified && <MaterialIcons name="verified" size={19} color="#3B9CEB" className="ml-2" />}
                </View>
                <Text className="text-gray-500 text-base mt-1">{post.authorHandle}</Text>
              </View>
            </TouchableOpacity>
            <Text className="text-white text-[21px] leading-7 mt-5">{post.content}</Text>
            {post.media?.map((attachment) => <Image key={attachment.id} source={{ uri: attachment.uri }} className="w-full h-52 rounded-2xl mt-4" />)}
            <Text className="text-gray-500 text-xs mt-5">3:59 PM · 10/10/26 · <Text className="text-gray-200">{formatMetric(post.views)} Views</Text></Text>
            <View className="flex-row items-center mt-5 gap-2">
              <TouchableOpacity onPress={() => replyInputRef.current?.focus()} className="bg-[#4A9AE8] rounded-full px-5 py-2.5 flex-row items-center" accessibilityLabel="Reply to post">
                <Feather name="message-circle" size={17} color="white" /><Text className="text-white text-sm ml-2">Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleRepost(post.id)} className="bg-[#303035] rounded-full px-5 py-2.5 flex-row items-center" accessibilityLabel="Repost">
                <Feather name="repeat" size={18} color="#8A8A91" /><Text className="text-gray-400 text-sm ml-2">{formatMetric(post.reposts)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleLike(post.id)} className="bg-[#303035] rounded-full px-5 py-2.5 flex-row items-center" accessibilityLabel="Like post">
                <Feather name="heart" size={18} color={post.likedByPlayer ? '#EF4444' : '#8A8A91'} /><Text className="text-gray-400 text-sm ml-2">{formatMetric(post.likes)}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {replies.map((reply) => <PostComment key={reply.id} comment={reply} />)}
        </ScrollView>

        <View className="border-t border-[#303035] px-5 py-3 flex-row items-center bg-[#19191B]">
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=raghav' }} className="w-9 h-9 rounded-full mr-3" />
          <View className="flex-1 flex-row items-center bg-[#29292D] rounded-full px-4 min-h-[48px]">
            <TextInput ref={replyInputRef} value={draft} onChangeText={setDraft} onSubmitEditing={sendReply} returnKeyType="send" placeholder="Reply..." placeholderTextColor="#8A8A91" className="flex-1 text-gray-200 text-[15px]" />
            {draft.trim().length > 0 && <TouchableOpacity onPress={sendReply} accessibilityLabel="Post reply"><Feather name="send" size={19} color="#4A9AE8" /></TouchableOpacity>}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
