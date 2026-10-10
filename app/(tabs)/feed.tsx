import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import PostCard from '../../components/PostCard';
import { rankPosts, useFeedStore } from '../../stores/feedStore';
import { useStoryStore } from '../../stores/storyStore';

export default function Feed() {
  const [actionsOpen, setActionsOpen] = useState(false);
  const posts = useFeedStore((state) => state.posts);
  const playerStats = useFeedStore((state) => state.playerStats);
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const toggleRepost = useFeedStore((state) => state.toggleRepost);
  const simulateNpcTick = useFeedStore((state) => state.simulateNpcTick);
  const stories = useStoryStore((state) => state.stories);
  const rankedPosts = rankPosts(posts);

  useEffect(() => {
    const interval = setInterval(simulateNpcTick, 30000);
    return () => clearInterval(interval);
  }, [simulateNpcTick]);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0A]" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center px-4 py-2">
          <View className="flex-row items-center">
            <Feather name="sun" size={20} color="#FBBF24" />
            <Text className="text-white font-bold text-lg ml-2">Day 4</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Text className="text-gray-500 text-xs">{playerStats.reach} reach</Text>
            <TouchableOpacity onPress={() => router.push('/store')} className="bg-[#242424] p-2 rounded-full">
              <MaterialCommunityIcons name="storefront" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate('/')} className="bg-[#3B1C1C] p-2 rounded-full border border-red-900/50">
              <MaterialCommunityIcons name="exit-to-app" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row px-4 py-2 items-center justify-between">
          <View className="flex-row items-center flex-1 bg-[#1A1A1A] rounded-xl p-2 mr-3 border border-gray-800">
            <Ionicons name="flash" size={20} color="#FBBF24" className="mx-1" />
            <View className="w-[1px] h-5 bg-gray-700 mx-2" />
            <Text className="text-yellow-500 font-black text-sm tracking-widest">MAX</Text>
          </View>
          <View className="flex-row items-center bg-[#1A1A1A] rounded-xl p-2 min-w-[80px] border border-gray-800">
            <MaterialCommunityIcons name="hexagon-slice-6" size={20} color="#A855F7" className="mx-1" />
            <View className="w-[1px] h-5 bg-gray-700 mx-2" />
            <Text className="text-white font-black text-sm tracking-widest">9,999</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4 py-4">
          <TouchableOpacity onPress={() => router.push({ pathname: '/story', params: { mode: 'create' } })} className="items-center mr-4" accessibilityLabel="Add story">
            <View className="w-16 h-16 rounded-full border-2 border-gray-800 items-center justify-center relative">
              <Image source={{ uri: 'https://i.pravatar.cc/150?u=raghav' }} className="w-14 h-14 rounded-full opacity-60" />
              <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-black"><Feather name="plus" size={12} color="white" /></View>
            </View>
            <Text className="text-gray-400 text-xs font-medium mt-1">Add story</Text>
          </TouchableOpacity>
          {stories.map((story) => (
            <TouchableOpacity key={story.id} onPress={() => router.push({ pathname: '/story', params: { id: story.id } })} className="items-center mr-4" accessibilityLabel={`Open ${story.authorName}'s story`}>
              <View className={`w-16 h-16 rounded-full border-2 items-center justify-center relative ${story.viewed ? 'border-gray-700' : 'border-green-500'}`}>
                <Image source={{ uri: story.avatar }} className="w-14 h-14 rounded-full" />
                {!story.viewed && <View className="absolute bottom-0 right-0 bg-green-500 rounded-full p-0.5 border-2 border-black"><MaterialIcons name="star" size={12} color="white" /></View>}
              </View>
              <Text className="text-gray-400 text-xs font-medium mt-1">{story.authorName.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="border-t border-gray-800">
          {rankedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => toggleLike(post.id)}
              onRepost={() => toggleRepost(post.id)}
              onReply={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })}
              onOpen={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })}
              onAuthor={() => router.push({ pathname: '/user/[id]', params: { id: post.authorId } })}
              showAuthorLink={false}
            />
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-6 right-4 items-end z-50">
        {actionsOpen && (
          <View className="items-end gap-3 mb-3">
            <TouchableOpacity onPress={() => router.push('/event')} className="flex-row items-center" accessibilityLabel="Open world event">
              <Text className="text-white text-lg font-medium mr-3">Activity</Text>
              <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center"><Feather name="calendar" size={28} color="white" /></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/create-post')} className="flex-row items-center" accessibilityLabel="Create post">
              <Text className="text-white text-lg font-medium mr-3">Post</Text>
              <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center"><Feather name="edit-3" size={26} color="white" /></View>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity onPress={() => setActionsOpen((open) => !open)} className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center shadow-lg border border-blue-400" accessibilityLabel={actionsOpen ? 'Close actions' : 'Open actions'}>
          <Feather name={actionsOpen ? 'x' : 'plus'} size={32} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
