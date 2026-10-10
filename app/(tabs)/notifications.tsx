import { useEffect, useMemo } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFeedStore } from '../../stores/feedStore';
import MentionText from '../../components/MentionText';
import { useNotificationStore } from '../../stores/notificationStore';

type NotificationGroup = {
  postId: string;
  postAuthorName: string;
  replies: ReturnType<typeof getRepliesForPost>;
};

function getRepliesForPost(replies: ReturnType<typeof useFeedStore.getState>['repliesByPost'][string]) {
  return replies
    .filter((reply) => reply.status !== 'failed')
    .sort((a, b) => b.createdAt - a.createdAt);
}

export default function Notifications() {
  const posts = useFeedStore((state) => state.posts);
  const repliesByPost = useFeedStore((state) => state.repliesByPost);
  const otherNotifications = useNotificationStore((state) => state.notifications.filter((item) => item.type !== 'reply' && item.type !== 'mention'));
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  useEffect(() => {
    markAllRead();
  }, [markAllRead]);
  const notifications = useMemo<NotificationGroup[]>(() => {
    const postMap = new Map(posts.map((post) => [post.id, post]));
    const grouped = new Map<string, NotificationGroup>();

    Object.values(repliesByPost).flat().forEach((reply) => {
      const post = postMap.get(reply.postId);
      if (!post || reply.authorId === 'player' || reply.status === 'failed') return;
      const mentionsPlayer = /(?:^|\s)@raghav\b/i.test(reply.body);
      if (post.authorId !== 'player' && !mentionsPlayer) return;

      const existing = grouped.get(post.id);
      if (existing) {
        existing.replies.push(reply);
      } else {
        grouped.set(post.id, {
          postId: post.id,
          postAuthorName: post.authorName,
          replies: [reply],
        });
      }
    });

    return Array.from(grouped.values())
      .map((group) => ({
        ...group,
        replies: getRepliesForPost(group.replies),
      }))
      .sort((a, b) => (b.replies[0]?.createdAt ?? 0) - (a.replies[0]?.createdAt ?? 0));
  }, [posts, repliesByPost]);

  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top']}>
      <View className="px-10 pt-8 pb-7 border-b border-[#3B3B3F]">
        <Text className="text-[#F1F1F3] text-[34px] font-semibold tracking-tight">Notifications</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {notifications.map((group) => {
          const latestReply = group.replies[0];
          const participants = Array.from(new Map(group.replies.map((reply) => [reply.authorId, reply])).values());
          const names = participants.map((reply) => reply.authorName);
          const visibleReplies = participants.slice(0, 3);
          const visibleNames = visibleReplies.map((reply) => reply.authorName);
          const others = Math.max(0, names.length - visibleReplies.length);
          const isMention = group.postAuthorName !== 'Raghav';

          return (
            <TouchableOpacity
              key={group.postId}
              onPress={() => router.push({ pathname: '/post/[id]', params: { id: group.postId, replyId: latestReply.id } })}
              className="px-10 py-7 border-b border-[#3B3B3F]"
              activeOpacity={0.75}
              accessibilityLabel={`Open replies from ${names.join(', ')}`}
            >
              <View className="flex-row items-start">
                <View className="w-16 items-center pt-1">
                  <View className="w-10 h-10 items-center justify-center">
                    <Feather name={isMention ? 'at-sign' : 'message-circle'} size={29} color="#4B9BE8" />
                  </View>
                  <View className="flex-row items-center mt-3">
                    {visibleReplies.slice(0, 2).map((reply, index) => (
                      <Image
                        key={reply.authorId}
                        source={{ uri: reply.avatar }}
                        className={`w-11 h-11 rounded-full border-2 border-[#121214] ${index > 0 ? '-ml-3' : ''}`}
                      />
                    ))}
                    {others > 0 && (
                      <View className="-ml-3 w-11 h-11 rounded-full bg-[#36363D] border-2 border-[#121214] items-center justify-center">
                        <Text className="text-[#B9B9C0] text-sm">+{others}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View className="flex-1 ml-4">
                  <Text className="text-[#F1F1F3] text-[20px] leading-7">
                    <Text className="font-medium">{visibleNames.join(', ')}</Text>
                    {others > 0 ? ` and ${others} other${others === 1 ? '' : 's'}` : ''}
                    <Text className="text-[#F1F1F3]"> {isMention ? 'mentioned you' : 'replied to you'}</Text>
                    <Text className="text-[#8C8C94]"> · Day 4</Text>
                  </Text>
                  <MentionText content={`${latestReply.authorName}: ${latestReply.body}`} className="text-[#A7A7AE] text-[17px] leading-6 mt-4" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        {otherNotifications.map((notification) => (
          <TouchableOpacity key={notification.id} className="px-10 py-6 border-b border-[#3B3B3F]" activeOpacity={0.75}>
            <View className="flex-row items-start">
              <View className="w-16 items-center">
                <View className="w-10 h-10 rounded-full bg-[#263F68] items-center justify-center">
                  <Feather name={notification.type === 'message' ? 'message-circle' : notification.type === 'event' ? 'zap' : 'activity'} size={22} color="#4B9BE8" />
                </View>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-[#F1F1F3] text-[18px] font-semibold">{notification.title}</Text>
                <Text className="text-[#A7A7AE] text-[16px] leading-6 mt-2">{notification.body}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {notifications.length === 0 && (
          <View className="items-center px-8 pt-24">
            <Feather name="bell" size={44} color="#71717A" />
            <Text className="text-white font-semibold text-base mt-5">No notifications yet</Text>
            <Text className="text-gray-500 text-center text-sm mt-2">Replies to your posts and mentions of you will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
