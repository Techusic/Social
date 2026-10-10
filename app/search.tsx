import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFeedStore } from '../stores/feedStore';

export default function Search() {
  const posts = useFeedStore((state) => state.posts);
  const [query, setQuery] = useState('');
  const results = posts.filter((post) => `${post.authorName} ${post.authorHandle} ${post.content}`.toLowerCase().includes(query.toLowerCase()));
  return <SafeAreaView className="flex-1 bg-[#121214]" edges={['top', 'bottom']}><View className="flex-row items-center px-5 py-4"><TouchableOpacity onPress={() => router.back()}><Feather name="arrow-left" size={26} color="white" /></TouchableOpacity><TextInput value={query} onChangeText={setQuery} autoFocus placeholder="Search people and posts" placeholderTextColor="#71717A" className="flex-1 bg-[#29292D] rounded-full px-4 py-3 text-white ml-4" /></View><ScrollView className="px-5">{results.map((post) => <TouchableOpacity key={post.id} onPress={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })} className="py-4 border-b border-gray-800"><Text className="text-white font-bold">{post.authorName}</Text><Text className="text-gray-400 mt-1" numberOfLines={2}>{post.content}</Text></TouchableOpacity>)}</ScrollView></SafeAreaView>;
}
