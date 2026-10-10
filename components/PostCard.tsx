import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import type { Post } from '../types/feed';

type PostCardProps = {
  post: Post;
  onLike: () => void;
  onRepost: () => void;
  onReply: () => void;
  onOpen: () => void;
  onAuthor: () => void;
};

function renderFormattedContent(content: string) {
  return content.split(/(\B@[a-zA-Z0-9_]+|\B#[a-zA-Z0-9_]+)/g).map((part, index) => (
    <Text key={`${part}-${index}`} className={part.startsWith('@') || part.startsWith('#') ? 'text-blue-400' : undefined}>{part}</Text>
  ));
}

function formatMetric(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

export default function PostCard({ post, onLike, onRepost, onReply, onOpen, onAuthor }: PostCardProps) {
  const avatarUrl = `https://i.pravatar.cc/150?u=${post.authorId}`;

  return (
    <View className="flex-row px-4 py-3 bg-[#0A0A0A] border-b border-gray-900">
      <TouchableOpacity onPress={onOpen} accessibilityLabel={`Open ${post.authorName} profile`}>
        <Image source={{ uri: avatarUrl }} className="w-12 h-12 rounded-full mr-3" />
      </TouchableOpacity>
      <View className="flex-1">
        <TouchableOpacity onPress={onOpen} activeOpacity={0.85} accessibilityLabel={`Open post by ${post.authorName}`}>
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-row items-center flex-1 pr-2" style={{ gap: 4 }}>
              <TouchableOpacity onPress={onAuthor} className="flex-row items-center flex-1" accessibilityLabel={`Open ${post.authorName} profile`}>
                <Text className="text-white font-bold text-[15px]" numberOfLines={1}>{post.authorName}</Text>
                {post.verified && <MaterialIcons name="verified" size={16} color="#3B82F6" />}
                <Text className="text-gray-500 text-sm flex-1 ml-1" numberOfLines={1}>{post.authorHandle}</Text>
              </TouchableOpacity>
            </View>
            <Feather name="more-horizontal" size={16} color="#6B7280" />
          </View>
          <Text className="text-gray-100 text-sm leading-5 mb-3">{renderFormattedContent(post.content)}</Text>
          {post.media?.map((attachment) => (
            <Image key={attachment.id} source={{ uri: attachment.uri }} accessibilityLabel={attachment.alt} className="w-full h-44 rounded-xl mb-3" />
          ))}
        </TouchableOpacity>

        <View className="flex-row items-center justify-between pr-5">
          <TouchableOpacity onPress={onReply} accessibilityLabel="Reply to post" className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-1.5">{formatMetric(post.comments)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRepost} accessibilityLabel="Repost" className="flex-row items-center">
            <Feather name="repeat" size={16} color={post.repostedByPlayer ? '#22C55E' : '#6B7280'} />
            <Text className="text-gray-500 text-xs ml-1.5">{formatMetric(post.reposts)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onLike} accessibilityLabel="Like post" className="flex-row items-center">
            <Feather name="heart" size={16} color={post.likedByPlayer ? '#EF4444' : '#6B7280'} />
            <Text className="text-gray-500 text-xs ml-1.5">{formatMetric(post.likes)}</Text>
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Feather name="eye" size={15} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-1">{formatMetric(post.views)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
