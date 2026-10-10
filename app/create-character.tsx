import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function CreateCharacter() {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [followers, setFollowers] = useState('5k+');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to your photos to add a character photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const canCreate = Boolean(photoUri && name.trim() && handle.trim() && gender && bio.trim());

  const createCharacter = () => {
    if (!canCreate) {
      Alert.alert('Complete your character', 'Photo, name, handle, gender, and profile bio are required.');
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center px-7 pt-5 pb-5 border-b border-[#303035]">
          <TouchableOpacity onPress={() => router.back()} className="mr-5" accessibilityLabel="Back"><Feather name="arrow-left" size={30} color="white" /></TouchableOpacity>
          <Text className="text-white text-2xl font-semibold">Create custom character</Text>
        </View>
        <ScrollView className="px-7" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="items-center py-8">
            <TouchableOpacity onPress={choosePhoto} className="w-28 h-28 bg-[#303037] rounded-full items-center justify-center relative border border-[#55555F] overflow-visible" accessibilityLabel="Add character photo">
              {photoUri ? <Image source={{ uri: photoUri }} className="w-full h-full rounded-full" /> : <Feather name="user" size={48} color="#A1A1AA" />}
              <View className="absolute bottom-0 right-0 bg-[#4A9AE8] rounded-full p-2 border-2 border-[#19191B]"><Feather name="plus" size={18} color="white" /></View>
            </TouchableOpacity>
            <Text className="text-red-400 text-sm mt-3">Add a photo *</Text>
          </View>
          <Text className="text-gray-300 text-lg mb-2">Name <Text className="text-red-400">*</Text></Text>
          <TextInput value={name} onChangeText={setName} placeholder="e.g. Albert Einstein" placeholderTextColor="#71717A" className="bg-[#29292F] border border-[#3F3F46] text-white text-lg px-5 py-4 rounded-2xl mb-5" />
          <Text className="text-gray-300 text-lg mb-2">Handle <Text className="text-red-400">*</Text></Text>
          <TextInput value={handle} onChangeText={setHandle} autoCapitalize="none" placeholder="@albert_einstein" placeholderTextColor="#71717A" className="bg-[#29292F] border border-[#3F3F46] text-white text-lg px-5 py-4 rounded-2xl mb-5" />
          <Text className="text-gray-300 text-lg mb-2">Gender <Text className="text-red-400">*</Text></Text>
          <View className="flex-row gap-3 mb-5">{['Male', 'Female', 'Non-binary'].map((item) => <TouchableOpacity key={item} onPress={() => setGender(item)} className={`px-5 py-3 rounded-full border ${gender === item ? 'bg-[#4A9AE8] border-blue-300' : 'bg-[#29292F] border-[#3F3F46]'}`}><Text className="text-white text-base">{item}</Text></TouchableOpacity>)}</View>
          <Text className="text-gray-300 text-lg mb-2">Profile bio <Text className="text-red-400">*</Text></Text>
          <TextInput value={bio} onChangeText={setBio} multiline maxLength={1000} placeholder="e.g. F1 driver, cat lover, and coffee enthusiast" placeholderTextColor="#71717A" className="bg-[#29292F] border border-[#3F3F46] text-white text-lg px-5 py-4 rounded-2xl mb-5 min-h-28" textAlignVertical="top" />
          <Text className="text-gray-300 text-lg mb-3">Follower count</Text>
          <View className="flex-row flex-wrap gap-3 mb-8">{['+ Custom', '1k+', '10k+', '100k+', '50k+', '20k+', '5k+'].map((item) => <TouchableOpacity key={item} onPress={() => setFollowers(item)} className={`px-5 py-3 rounded-full border ${followers === item ? 'bg-[#4A9AE8] border-blue-300' : 'bg-[#29292F] border-[#3F3F46]'}`}><Text className="text-white text-base">{item}</Text></TouchableOpacity>)}</View>
          <View className="border-t border-[#303035] pt-7">
            <Text className="text-gray-300 text-lg mb-3">Additional descriptions <Text className="text-gray-500">(optional)</Text></Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={1500}
              placeholder="Influence the character's behaviour and personality with traits, backstories etc."
              placeholderTextColor="#A1A1AA"
              className="bg-[#29292F] border border-[#3F3F46] text-white text-lg px-5 py-4 rounded-2xl min-h-32"
              textAlignVertical="top"
            />
          </View>

          <Text className="text-gray-300 text-lg mt-8 mb-3">Privacy settings</Text>
          <View className="bg-[#29292F] border border-[#3F3F46] rounded-2xl px-5 py-5 mb-8 flex-row items-start">
            <View className="flex-1 pr-4">
              <Text className="text-white text-xl">Make character public</Text>
              <Text className="text-gray-400 text-lg leading-7 mt-2">Allow other users to search and add this character to their worlds</Text>
            </View>
            <Switch value={isPublic} onValueChange={setIsPublic} trackColor={{ false: '#71717A', true: '#2563EB' }} thumbColor="#F4F4F5" accessibilityLabel="Make character public" />
          </View>

          <TouchableOpacity onPress={createCharacter} disabled={!canCreate} className={`${canCreate ? 'bg-[#4A9AE8]' : 'bg-[#5A5962]'} py-4 rounded-full items-center mb-10`}><Text className={`${canCreate ? 'text-white' : 'text-[#B3B1B8]'} text-xl font-semibold`}>Create character</Text></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
