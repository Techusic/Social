import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useProfileStore } from '../stores/profileStore';

export default function EditProfile() {
  const profile = useProfileStore();
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [description, setDescription] = useState(profile.description);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);
  const [coverUri, setCoverUri] = useState(profile.coverUri);

  const chooseImage = async (target: 'avatar' | 'cover') => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to your photos to update your profile image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: target === 'cover' ? [3, 1] : [1, 1],
      quality: 1,
    });
    if (result.canceled) return;
    if (target === 'cover') setCoverUri(result.assets[0].uri);
    else setAvatarUri(result.assets[0].uri);
  };

  const save = () => {
    const trimmedName = name.trim();
    const trimmedBio = bio.trim();
    const trimmedDescription = description.trim();
    if (!trimmedName || !trimmedBio || !trimmedDescription) {
      Alert.alert('Complete your profile', 'Add a character name, profile bio, and description before saving.');
      return;
    }
    profile.updateProfile({ name: trimmedName, bio: trimmedBio, description: trimmedDescription, avatarUri, coverUri });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between px-5 py-5">
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back to profile">
            <Feather name="arrow-left" size={28} color="#E4E4E7" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-semibold">Edit Profile</Text>
          <View className="w-7" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="px-7 pt-5">
            <View className="relative">
              <Image source={{ uri: coverUri }} className="w-full h-44 rounded-2xl" />
              <TouchableOpacity onPress={() => chooseImage('cover')} className="absolute top-3 right-3 bg-[#202124]/90 rounded-full p-3" accessibilityLabel="Change cover photo">
                <Feather name="edit-2" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <View className="items-center -mt-12 mb-9">
              <View className="relative">
                <Image source={{ uri: avatarUri }} className="w-24 h-24 rounded-full border-4 border-[#19191B]" />
                <TouchableOpacity onPress={() => chooseImage('avatar')} className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#4A9AE8] items-center justify-center border-2 border-[#19191B]" accessibilityLabel="Change profile photo">
                  <Feather name="plus" size={22} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-gray-400 text-lg mb-3">Character name</Text>
            <TextInput value={name} onChangeText={setName} className="bg-[#343439] rounded-2xl px-5 py-4 text-white text-xl mb-8" />

            <Text className="text-gray-400 text-lg mb-3">Handle</Text>
            <View className="bg-[#29292D] rounded-2xl px-5 py-4 flex-row items-center">
              <Text className="text-gray-500 text-xl mr-3">@</Text>
              <Text className="text-gray-400 text-xl">{profile.handle.replace('@', '')}</Text>
            </View>
            <Text className="text-gray-500 text-base mt-2 mb-8">Editing your handle is temporarily disabled.</Text>

            <Text className="text-gray-400 text-lg mb-3">Profile bio</Text>
            <TextInput value={bio} onChangeText={setBio} multiline maxLength={1000} className="bg-[#343439] rounded-2xl px-5 py-4 text-white text-xl min-h-44" textAlignVertical="top" />
            <Text className="text-gray-500 text-right text-base mt-2 mb-7">{bio.length}/1000</Text>

            <Text className="text-gray-400 text-lg mb-3">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={1500}
              className="bg-[#343439] rounded-2xl px-5 py-4 text-white text-xl min-h-44"
              textAlignVertical="top"
            />
            <Text className="text-gray-500 text-right text-base mt-2 mb-7">{description.length}/1500</Text>

            <TouchableOpacity onPress={save} className="bg-[#4A9AE8] rounded-full py-4 items-center" accessibilityLabel="Save profile">
              <Text className="text-white text-xl font-medium">Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
