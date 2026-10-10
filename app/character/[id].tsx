import { useMemo } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../components/PostCard';
import { useFeedStore } from '../../stores/feedStore';

type CharacterProfile = {
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio: string;
  followers: string;
  relationship: string;
  relationshipDelta: string;
  relationshipPercent: string;
  relationshipDescription: string;
};

const characters: Record<string, CharacterProfile> = {
  ginny: {
    name: 'Ginny Weasley',
    handle: '@thebestweasley',
    avatar: 'https://i.pravatar.cc/300?u=ginny',
    cover: 'https://images.unsplash.com/photo-1516979187457-637if4f0d4b4?q=80&w=1200&auto=format&fit=crop',
    bio: 'The only Weasley who’s always right.',
    followers: '1.0M',
    relationship: 'Public rivals',
    relationshipDelta: '+1.0%',
    relationshipPercent: '3.8%',
    relationshipDescription: 'She respects the sheer chaos of your rising notoriety.',
  },
};

const fallbackCharacter: CharacterProfile = {
  name: 'Character',
  handle: '@character',
  avatar: 'https://i.pravatar.cc/300?u=character',
  cover: 'https://images.unsplash.com/photo-1516979187457-637if4f0d4b4?q=80&w=1200&auto=format&fit=crop',
  bio: 'A character in your living world.',
  followers: '7.3K',
  relationship: 'Getting acquainted',
  relationshipDelta: '+0.1%',
  relationshipPercent: '1.0%',
  relationshipDescription: 'Your relationship is still taking shape.',
};

export default function CharacterProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const character = characters[id ?? ''] ?? fallbackCharacter;
  const allPosts = useFeedStore((state) => state.posts);
  const posts = useMemo(() => allPosts.filter((post) => post.authorId === id), [allPosts, id]);
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const toggleRepost = useFeedStore((state) => state.toggleRepost);

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Image source={{ uri: character.cover }} className="w-full h-64" />
          <View className="absolute top-5 left-5 right-5 flex-row justify-between">
            <TouchableOpacity onPress={() => router.back()} className="w-14 h-14 rounded-full bg-black/70 items-center justify-center" accessibilityLabel="Back">
              <Feather name="arrow-left" size={30} color="white" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="bg-[#303037] rounded-full px-6 py-4 flex-row items-center">
                <MaterialCommunityIcons name="crown" size={20} color="#E5E7EB" />
                <Text className="text-gray-200 text-lg font-semibold ml-2">Get Plus</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-14 h-14 rounded-full bg-[#303037] items-center justify-center" accessibilityLabel="Character options">
                <Feather name="user-minus" size={24} color="#E5E7EB" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="absolute bottom-[-30px] left-8">
            <Image source={{ uri: character.avatar }} className="w-32 h-32 rounded-full border-8 border-[#19191B]" />
          </View>
          <View className="absolute bottom-[-3px] left-[292px] w-7 h-7 rounded-full bg-[#303037] border-2 border-[#19191B]" />
        </View>

        <View className="px-8 pt-12">
          <View className="items-end mb-8">
            <TouchableOpacity className="bg-[#303037] rounded-full px-10 py-4" accessibilityLabel="Edit character details">
              <Text className="text-white text-xl">Edit details</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <Text className="text-white text-3xl font-bold">{character.name}</Text>
            <MaterialIcons name="verified" size={30} color="#3B9CEB" className="ml-2" />
          </View>
          <Text className="text-gray-500 text-2xl mt-2">{character.handle}</Text>
          <Text className="text-white text-xl mt-5">{character.bio}</Text>
          <Text className="text-white text-2xl font-bold mt-7">{character.followers} <Text className="text-gray-400 font-normal">Followers</Text></Text>

          <TouchableOpacity onPress={() => router.push('/conversation')} className="bg-[#303037] rounded-full py-4 mt-8 flex-row items-center justify-center" accessibilityLabel={`Message ${character.name}`}>
            <MaterialCommunityIcons name="message" size={24} color="white" />
            <Text className="text-white text-xl ml-3">Message</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-between mt-12 mb-5">
            <Text className="text-white text-2xl font-semibold">Your Relationship</Text>
            <Feather name="star" size={26} color="#8A8A91" />
          </View>
          <View className="bg-[#242428] border border-[#3B3B42] rounded-3xl p-8">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-xl font-medium">{character.relationship}</Text>
              <Text className="text-emerald-400 text-xl font-semibold">{character.relationshipDelta}</Text>
            </View>
            <View className="h-10 rounded-full bg-[#3B3B42] mt-5 overflow-hidden">
              <View className="h-full w-[52%] bg-[#45454D] rounded-l-full" />
              <View className="absolute left-[48%] top-0 bottom-0 w-3 bg-yellow-400 rounded-full" />
            </View>
            <Text className="text-white text-xl text-right mt-2">{character.relationshipPercent}</Text>
            <Text className="text-gray-300 text-xl leading-7 mt-1">{character.relationshipDescription}</Text>
            <TouchableOpacity className="bg-[#303037] rounded-full py-4 mt-6 flex-row items-center justify-center" accessibilityLabel="Change relationship chemistry">
              <MaterialCommunityIcons name="account-heart" size={25} color="white" />
              <Text className="text-white text-xl ml-3">Change chemistry</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-white text-2xl font-semibold mt-12 mb-6">Stories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1 mb-10">
            <View className="w-52 h-72 rounded-3xl overflow-hidden mr-4">
              <Image source={{ uri: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?q=80&w=600&auto=format&fit=crop' }} className="w-full h-full" />
              <Text className="absolute bottom-5 left-5 right-4 text-white text-lg">seriously, &apos;a marriage of mi...</Text>
            </View>
            <View className="w-52 h-72 rounded-3xl overflow-hidden bg-red-700">
              <Text className="absolute bottom-5 left-5 right-4 text-white text-lg">i sneaked into the owlery</Text>
            </View>
          </ScrollView>

          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-white text-2xl font-semibold">Posts</Text>
            <Text className="text-gray-500 text-base">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</Text>
          </View>
          <View className="-mx-8">
            {posts.length > 0 ? posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => toggleLike(post.id)}
                onRepost={() => toggleRepost(post.id)}
                onReply={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })}
                onOpen={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })}
                onAuthor={() => router.push({ pathname: '/user/[id]', params: { id: post.authorId } })}
              />
            )) : (
              <View className="mx-8 rounded-2xl bg-[#242428] border border-[#3B3B42] px-5 py-8 items-center">
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
