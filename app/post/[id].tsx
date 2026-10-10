import { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFeedStore } from '../../stores/feedStore';
import type { Reply } from '../../types/feed';
import MentionText from '../../components/MentionText';
import { canOpenProfile } from '../../utils/profileLinks';

const EMPTY_REPLIES: Reply[] = [];

function formatMetric(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

function PostComment({ comment, depth, onReply, onLike, onRetry }: { comment: Reply; depth: number; onReply: (comment: Reply) => void; onLike: () => void; onRetry?: () => void }) {
  return (
    <View className={`px-5 py-4 border-b border-[#303035] ${depth > 0 ? 'ml-8' : ''}`}>
      <View className="flex-row">
        <TouchableOpacity disabled={!canOpenProfile(comment.authorId)} onPress={() => router.push({ pathname: '/user/[id]', params: { id: comment.authorId } })} accessibilityLabel={`Open ${comment.authorName} profile`}>
          <Image source={{ uri: comment.avatar }} className="w-10 h-10 rounded-full mr-3" />
        </TouchableOpacity>
        <View className="flex-1">
          <TouchableOpacity disabled={!canOpenProfile(comment.authorId)} onPress={() => router.push({ pathname: '/user/[id]', params: { id: comment.authorId } })} className="flex-row items-center" accessibilityLabel={`Open ${comment.authorName} profile`}>
            <Text className="text-white text-base font-bold">{comment.authorName}</Text>
            <Text className="text-gray-500 text-sm ml-2">{comment.authorHandle}</Text>
          </TouchableOpacity>
          <MentionText content={comment.body} className="text-gray-100 text-[15px] leading-5 mt-2" />
          {comment.status === 'sending' && <Text className="text-yellow-400 text-[10px] mt-2 uppercase tracking-[0.15em]">Sending…</Text>}
          {comment.status === 'failed' && (
            <View className="mt-2 flex-row items-center gap-2">
              <Text className="text-red-400 text-[10px] uppercase tracking-[0.15em]">Failed</Text>
              {onRetry && (
                <TouchableOpacity onPress={onRetry} className="bg-[#2B2B30] border border-[#3A3A40] rounded-full px-2 py-1">
                  <Text className="text-gray-100 text-[10px] uppercase tracking-[0.15em]">Retry</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View className="flex-row items-center mt-4">
            <TouchableOpacity onPress={onLike} className="flex-row items-center" accessibilityLabel={`Like ${comment.authorName}'s reply`}>
              <Feather name="heart" size={17} color={comment.likedByPlayer ? '#EF4444' : '#8A8A91'} />
              <Text className="text-gray-500 text-xs ml-2">{formatMetric(comment.likes)}</Text>
            </TouchableOpacity>
            <Text className="text-gray-600 text-base mx-3">|</Text>
            <TouchableOpacity onPress={() => onReply(comment)} accessibilityLabel={`Reply to ${comment.authorName}`}>
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
  const replies = useFeedStore((state) => state.repliesByPost[id ?? ''] ?? EMPTY_REPLIES);
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const toggleRepost = useFeedStore((state) => state.toggleRepost);
  const addReply = useFeedStore((state) => state.addReply);
  const retryReply = useFeedStore((state) => state.retryReply);
  const toggleReplyLike = useFeedStore((state) => state.toggleReplyLike);
  const [draft, setDraft] = useState('');
  const [replyingTo, setReplyingTo] = useState<Reply | null>(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const replyInputRef = useRef<TextInput>(null);

  const mentionMatch = draft.match(/(?:^|\s)@([A-Za-z0-9_]*)$/);
  const mentionPrefix = mentionMatch?.[1] ?? '';
  const authorCandidates = post
    ? [
        { id: post.authorId, name: post.authorName, handle: post.authorHandle },
        ...replies
          .map((reply) => ({ id: reply.authorId, name: reply.authorName, handle: reply.authorHandle }))
          .filter((candidate, index, collection) => collection.findIndex((item) => item.id === candidate.id) === index),
      ]
    : [];
  const mentionSuggestions = mentionPrefix
    ? authorCandidates
        .filter((candidate) => {
          const phrase = `${candidate.handle} ${candidate.name}`.toLowerCase();
          return phrase.includes(mentionPrefix.toLowerCase());
        })
        .slice(0, 5)
    : [];

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
    if (!body || isSubmittingReply) return;

    setIsSubmittingReply(true);
    addReply(post.id, {
      authorId: 'player',
      authorName: 'Raghav',
      authorHandle: '@raghav',
      avatar: 'https://i.pravatar.cc/150?u=raghav',
      body,
      parentReplyId: replyingTo?.id,
    });

    setDraft('');
    setReplyingTo(null);
    requestAnimationFrame(() => {
      setIsSubmittingReply(false);
    });
  };

  const startReplyTo = (reply: Reply) => {
    const mention = `${reply.authorHandle} `;
    setReplyingTo(reply);
    setDraft((current) => {
      const trimmed = current.trim();
      if (!trimmed) return mention;
      return trimmed.startsWith(mention) ? current : `${mention}${current}`;
    });
    requestAnimationFrame(() => replyInputRef.current?.focus());
  };

  const applyMention = (handle: string) => {
    if (!mentionPrefix) {
      setDraft((current) => `${current.trimEnd()} ${handle} `);
      return;
    }

    setDraft((current) => {
      const mentionStart = current.lastIndexOf('@');
      const nextDraft = current.slice(0, mentionStart) + handle + ' ';
      return nextDraft;
    });
    requestAnimationFrame(() => replyInputRef.current?.focus());
  };

  const startPostReply = () => {
    setReplyingTo(null);
    setDraft((current) => {
      const mention = `${post.authorHandle} `;
      const trimmed = current.trim();
      return trimmed.startsWith(post.authorHandle) ? current : (trimmed ? `${mention}${current}` : mention);
    });
    requestAnimationFrame(() => replyInputRef.current?.focus());
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
            <MentionText content={post.content} className="text-white text-[21px] leading-7 mt-5" />
            {post.media?.map((attachment) => <Image key={attachment.id} source={{ uri: attachment.uri }} className="w-full h-52 rounded-2xl mt-4" />)}
            <Text className="text-gray-500 text-xs mt-5">3:59 PM · 10/10/26 · <Text className="text-gray-200">{formatMetric(post.views)} Views</Text></Text>
            <View className="flex-row items-center mt-5 gap-2">
              <TouchableOpacity onPress={startPostReply} className="bg-[#4A9AE8] rounded-full px-5 py-2.5 flex-row items-center" accessibilityLabel="Reply to post">
                <Feather name="message-circle" size={17} color="white" /><Text className="text-white text-sm ml-2">Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleRepost(post.id)} hitSlop={8} className={`rounded-full px-5 py-2.5 flex-row items-center ${post.repostedByPlayer ? 'bg-[#123B2A]' : 'bg-[#303035]'}`} accessibilityLabel={post.repostedByPlayer ? 'Undo repost' : 'Repost'}>
                <Feather name="repeat" size={18} color={post.repostedByPlayer ? '#22C55E' : '#8A8A91'} /><Text className={`${post.repostedByPlayer ? 'text-green-400' : 'text-gray-400'} text-sm ml-2`}>{post.repostedByPlayer ? 'Reposted' : 'Repost'} · {formatMetric(post.reposts)}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleLike(post.id)} className="bg-[#303035] rounded-full px-5 py-2.5 flex-row items-center" accessibilityLabel="Like post">
                <Feather name="heart" size={18} color={post.likedByPlayer ? '#EF4444' : '#8A8A91'} /><Text className="text-gray-400 text-sm ml-2">{formatMetric(post.likes)}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {replies.map((reply) => (
            <PostComment
              key={reply.id}
              comment={reply}
              depth={reply.parentReplyId ? 1 : 0}
              onReply={startReplyTo}
              onLike={() => toggleReplyLike(post.id, reply.id)}
              onRetry={reply.status === 'failed' ? () => retryReply(post.id, reply.id) : undefined}
            />
          ))}
        </ScrollView>

        <View className="border-t border-[#303035] px-5 py-3 flex-row items-center bg-[#19191B]">
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=raghav' }} className="w-9 h-9 rounded-full mr-3" />
          <View className="flex-1">
            {replyingTo && (
              <View className="flex-row items-center justify-between mb-2 px-2">
                <Text className="text-gray-500 text-xs">Replying to <Text className="text-blue-400">{replyingTo.authorHandle}</Text></Text>
                <TouchableOpacity onPress={() => { setReplyingTo(null); setDraft(''); }} accessibilityLabel="Cancel reply">
                  <Feather name="x" size={15} color="#8A8A91" />
                </TouchableOpacity>
              </View>
            )}
            <View className="flex-row items-center bg-[#29292D] rounded-full px-4 min-h-[48px]">
            <TextInput ref={replyInputRef} value={draft} onChangeText={setDraft} onSubmitEditing={sendReply} returnKeyType="send" placeholder="Reply..." placeholderTextColor="#8A8A91" className="flex-1 text-gray-200 text-[15px]" />
            {draft.trim().length > 0 && (
              <TouchableOpacity onPress={sendReply} accessibilityLabel="Post reply" disabled={isSubmittingReply}>
                <Feather name="send" size={19} color={isSubmittingReply ? '#64748B' : '#4A9AE8'} />
              </TouchableOpacity>
            )}
            </View>
            {mentionSuggestions.length > 0 && (
              <View className="mt-2 flex-row flex-wrap gap-2">
                {mentionSuggestions.map((candidate) => (
                  <TouchableOpacity
                    key={candidate.id}
                    onPress={() => applyMention(candidate.handle)}
                    className="bg-[#2B2B30] border border-[#3A3A40] rounded-full px-2 py-1"
                    accessibilityLabel={`Mention ${candidate.handle}`}
                  >
                    <Text className="text-gray-200 text-xs">{candidate.handle}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
