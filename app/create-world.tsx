import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useWorldStore } from '../stores/worldStore';

export default function CreateWorld() {
  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const chooseCover = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to your photos to add a world cover image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };

  const canCreate = Boolean(name.trim() && theme.trim() && description.trim());
  const createWorldEntity = useWorldStore((state) => state.createWorld);

  const createWorld = () => {
    if (!canCreate) {
      Alert.alert('Complete your world', 'World name, theme, and description are required.');
      return;
    }

    createWorldEntity({
      name: name.trim(),
      theme: theme.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      coverUri: coverUri ?? undefined,
      isPublic,
      settings: {
        difficulty: 'Normal',
        madnessScale: 'Normal',
        multiplayer: false,
        universeStories: true,
        newsAccounts: true,
        worldTone: tagline.trim() || theme.trim(),
        npcGuidance: 'Let characters react naturally to public posts and private conversations.',
        newsTone: 'Gossip and breaking news',
      },
    });
    router.replace('/(tabs)/feed');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center px-7 pt-5 pb-5 border-b border-[#303035]">
          <TouchableOpacity onPress={() => router.back()} className="mr-5" accessibilityLabel="Back">
            <Feather name="arrow-left" size={30} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-semibold">Create custom world</Text>
        </View>

        <ScrollView className="px-7" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="items-center py-8">
            <TouchableOpacity onPress={chooseCover} className="w-full h-40 bg-[#303037] rounded-3xl items-center justify-center relative border border-[#55555F] overflow-hidden" accessibilityLabel="Add world cover">
              {coverUri ? (
                <Image source={{ uri: coverUri }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <Feather name="image" size={36} color="#A1A1AA" />
                  <Text className="text-gray-400 text-base mt-3">Add world cover</Text>
                </View>
              )}
              <View className="absolute bottom-3 right-3 bg-[#4A9AE8] rounded-full p-2 border-2 border-[#19191B]">
                <Feather name="plus" size={18} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="text-red-400 text-sm mt-3">Add a cover image</Text>
          </View>

          <Text className="text-gray-300 text-lg mb-2">World name <Text className="text-red-400">*</Text></Text>
          <TextInput value={name} onChangeText={setName} placeholder="e.g. Hogwarts after dark" placeholderTextColor="#71717A" className="bg-[#29292F] border border-[#3F3F46] text-white text-lg px-5 py-4 rounded-2xl mb-5" />

          <Text className="text-gray-300 text-lg mb-2">Theme <Text className="text-red-400">*</Text></Text>
          <TextInput value={theme} onChangeText={setTheme} placeholder="Fantasy, romance, sci-fi, drama..." placeholderTextColor="#71717A" className="bg-[#29292F] border border-[#3F3F46] text-white text-lg px-5 py-4 rounded-2xl mb-5" />

          <Text className="text-gray-300 text-lg mb-2">Tagline</Text>
          <TextInput value={tagline} onChangeText={setTagline} placeholder="A magical campus with one big secret" placeholderTextColor="#71717A" className="bg-[#29292F] border border-[#3F3F46] text-white text-lg px-5 py-4 rounded-2xl mb-5" />

          <Text className="text-gray-300 text-lg mb-2">Description <Text className="text-red-400">*</Text></Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={1500}
            placeholder="Describe the tone, stakes, and social energy of your world."
            placeholderTextColor="#A1A1AA"
            className="bg-[#29292F] border border-[#3F3F46] text-white text-lg px-5 py-4 rounded-2xl min-h-32 mb-8"
            textAlignVertical="top"
          />

          <View className="border-t border-[#303035] pt-7">
            <Text className="text-gray-300 text-lg mb-3">Privacy settings</Text>
            <View className="bg-[#29292F] border border-[#3F3F46] rounded-2xl px-5 py-5 flex-row items-start">
              <View className="flex-1 pr-4">
                <Text className="text-white text-xl">Make world public</Text>
                <Text className="text-gray-400 text-lg leading-7 mt-2">Allow others to discover this world and join the cast.</Text>
              </View>
              <Switch value={isPublic} onValueChange={setIsPublic} trackColor={{ false: '#71717A', true: '#2563EB' }} thumbColor="#F4F4F5" accessibilityLabel="Make world public" />
            </View>
          </View>

          <TouchableOpacity onPress={createWorld} disabled={!canCreate} className={`${canCreate ? 'bg-[#4A9AE8]' : 'bg-[#5A5962]'} py-4 rounded-full items-center my-10`}>
            <Text className={`${canCreate ? 'text-white' : 'text-[#B3B1B8]'} text-xl font-semibold`}>Create world</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
