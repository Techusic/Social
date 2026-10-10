import { useMemo } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../components/PostCard';
import { useFeedStore } from '../../stores/feedStore';

type UserProfile = {
  name: string;
  handle: string;
  bio: string;
  avatar: string;
  cover: string;
  followers: string;
  relationship?: string;
  relationshipDescription?: string;
  isPlayer?: boolean;
};

function DivergingProgress({ value }: { value: number }) {
  const width = `${Math.min(50, Math.abs(value))}%` as `${number}%`;
  return (
    <View className="h-3 bg-[#3B3B42] rounded-full overflow-hidden relative mt-5">
      {value >= 0 ? (
        <View className="absolute left-1/2 top-0 bottom-0 bg-emerald-400" style={{ width }} />
      ) : (
        <View className="absolute right-1/2 top-0 bottom-0 bg-red-400" style={{ width }} />
      )}
      <View className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/70" />
    </View>
  );
}

const profiles: Record<string, UserProfile> = {
  ginny: {
    name: 'Ginny Weasley',
    handle: '@thebestweasley',
    bio: 'The only Weasley who’s always right.',
    avatar: 'https://i.pravatar.cc/300?u=ginny',
    cover: 'https://images.unsplash.com/photo-1516979187457-637if4f0d4b4?q=80&w=1200&auto=format&fit=crop',
    followers: '1.0M',
    relationship: 'Public rivals',
    relationshipDescription: 'She respects the sheer chaos of your rising notoriety.',
  },
  'quidditch-stats': {
    name: 'Quidditch Stats',
    handle: '@quidditch_stats',
    bio: 'Numbers never lie. Especially during a match.',
    avatar: 'https://i.pravatar.cc/300?u=quidditch-stats',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop',
    followers: '284K',
    relationship: 'Casual interest',
    relationshipDescription: 'They notice when your name enters the conversation.',
  },
  hermione: {
    name: 'Hermione Granger',
    handle: '@actually_reading',
    bio: 'Brightest witch of her age. Still correcting your citations.',
    avatar: 'https://i.pravatar.cc/300?u=hermione',
    cover: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=1200&auto=format&fit=crop',
    followers: '842K',
    relationship: 'Respectful acquaintances',
    relationshipDescription: 'She values your potential, even when your methods are questionable.',
  },
  player: {
    name: 'Raghav',
    handle: '@raghav',
    bio: 'Just here for the drama and the magic 😉.',
    avatar: 'https://i.pravatar.cc/300?u=raghav',
    cover: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=1200&auto=format&fit=crop',
    followers: '7.3K',
    isPlayer: true,
  },
};

const fallbackProfile = (id: string): UserProfile => ({
  name: id.replace(/-/g, ' '),
  handle: `@${id.replace(/-/g, '_')}`,
  bio: 'A voice in your living world.',
  avatar: `https://i.pravatar.cc/300?u=${id}`,
  cover: 'https://images.unsplash.com/photo-1516979187457-637if4f0d4b4?q=80&w=1200&auto=format&fit=crop',
  followers: '7.3K',
  relationship: 'Getting acquainted',
  relationshipDescription: 'Your relationship is still taking shape.',
});

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = profiles[id ?? ''] ?? fallbackProfile(id ?? 'character');
  const allPosts = useFeedStore((state) => state.posts);
  const posts = useMemo(() => allPosts.filter((post) => post.authorId === id), [allPosts, id]);
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const toggleRepost = useFeedStore((state) => state.toggleRepost);

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Image source={{ uri: profile.cover }} className="w-full h-60" />
          <TouchableOpacity onPress={() => router.back()} className="absolute top-5 left-5 w-14 h-14 rounded-full bg-black/70 items-center justify-center" accessibilityLabel="Back">
            <Feather name="arrow-left" size={30} color="white" />
          </TouchableOpacity>
          <View className="absolute bottom-[-30px] left-8">
            <Image source={{ uri: profile.avatar }} className="w-32 h-32 rounded-full border-8 border-[#19191B]" />
          </View>
        </View>

        <View className="px-8 pt-12">
          <View className="flex-row justify-end mb-7">
            {!profile.isPlayer && (
              <TouchableOpacity className="bg-[#303037] rounded-full px-6 py-4 flex-row items-center" accessibilityLabel="Get Plus">
                <MaterialCommunityIcons name="crown" size={20} color="#E5E7EB" />
                <Text className="text-gray-200 text-lg font-semibold ml-2">Get Plus</Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center">
            <Text className="text-white text-3xl font-bold">{profile.name}</Text>
            <MaterialIcons name="verified" size={29} color="#3B9CEB" className="ml-2" />
          </View>
          <Text className="text-gray-500 text-2xl mt-2">{profile.handle}</Text>
          <Text className="text-white text-xl mt-5">{profile.bio}</Text>
          <Text className="text-white text-2xl font-bold mt-7">{profile.followers} <Text className="text-gray-400 font-normal">Followers</Text></Text>

          {!profile.isPlayer && (
            <TouchableOpacity onPress={() => router.push('/conversation')} className="bg-[#303037] rounded-full py-4 mt-8 flex-row items-center justify-center" accessibilityLabel={`Message ${profile.name}`}>
              <MaterialCommunityIcons name="message" size={24} color="white" />
              <Text className="text-white text-xl ml-3">Message</Text>
            </TouchableOpacity>
          )}

          {!profile.isPlayer && (
            <View className="mt-12">
              <View className="flex-row items-center justify-between mb-5">
                <Text className="text-white text-2xl font-semibold">Your Relationship</Text>
                <Feather name="star" size={26} color="#8A8A91" />
              </View>
              <View className="bg-[#242428] border border-[#3B3B42] rounded-3xl p-7">
                <View className="flex-row justify-between">
                  <Text className="text-white text-xl">{profile.relationship}</Text>
                  <Text className="text-emerald-400 text-xl">+1.0%</Text>
                </View>
                <DivergingProgress value={3.8} />
                <Text className="text-white text-xl text-right mt-2">3.8%</Text>
                <Text className="text-gray-300 text-xl leading-7 mt-1">{profile.relationshipDescription}</Text>
                <TouchableOpacity className="bg-[#303037] rounded-full py-4 mt-6 flex-row items-center justify-center"><MaterialCommunityIcons name="account-heart" size={24} color="white" /><Text className="text-white text-xl ml-3">Change chemistry</Text></TouchableOpacity>
              </View>
            </View>
          )}

          <Text className="text-white text-2xl font-semibold mt-12 mb-5">Posts</Text>
          <View className="-mx-8">
            {posts.length > 0 ? posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={() => toggleLike(post.id)} onRepost={() => toggleRepost(post.id)} onReply={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })} onOpen={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })} onAuthor={() => router.push({ pathname: '/user/[id]', params: { id: post.authorId } })} />
            )) : (
              <View className="mx-8 bg-[#242428] rounded-2xl p-7 items-center">
                <Feather name="message-circle" size={28} color="#71717A" />
                <Text className="text-gray-400 text-base mt-3">No posts yet</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
