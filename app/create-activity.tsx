import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useActivityStore } from '../stores/activityStore';

export default function CreateActivity() {
  const addActivity = useActivityStore((state) => state.addActivity);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const create = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Add an activity title', 'Give this roleplay activity a name before creating it.');
      return;
    }
    addActivity({
      title: trimmedTitle,
      characterIds: selectedCharacter ? [selectedCharacter] : [],
      day: 4,
      time: '6 am',
      description: description.trim() || undefined,
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top', 'bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-[#303035]">
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back">
            <Feather name="arrow-left" size={28} color="#E4E4E7" />
          </TouchableOpacity>
          <Text className="text-white text-base font-semibold">Create Activity</Text>
          <TouchableOpacity onPress={create} disabled={!title.trim()} accessibilityLabel="Create activity">
            <Text className={`text-base font-semibold ${title.trim() ? 'text-gray-200' : 'text-gray-600'}`}>Create</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5 pt-6" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="flex-row items-start mb-4">
            <MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#A1A1AA" className="w-10 mt-3" />
            <TextInput
              value={title}
              onChangeText={setTitle}
              autoFocus
              placeholder="Activity title"
              placeholderTextColor="#A1A1AA"
              className="flex-1 bg-[#29292F] border border-blue-400 rounded-xl px-4 py-3 text-white text-base"
            />
          </View>

          <View className="flex-row items-start mb-3">
            <MaterialCommunityIcons name="account-multiple-outline" size={24} color="#A1A1AA" className="w-10 mt-3" />
            <View className="flex-1">
              <TouchableOpacity
                onPress={() => setSelectedCharacter(selectedCharacter === 'ginny' ? null : 'ginny')}
                className={`rounded-xl px-4 py-3 border ${selectedCharacter ? 'border-blue-400 bg-[#29292F]' : 'border-[#3F3F46] bg-[#29292F]'}`}
                accessibilityLabel="Add Ginny Weasley"
              >
                <Text className="text-gray-300 text-base">{selectedCharacter ? 'Ginny Weasley' : 'Add characters'}</Text>
              </TouchableOpacity>
              <Text className="text-gray-500 text-sm mt-2">Suggestions</Text>
              <TouchableOpacity onPress={() => setSelectedCharacter('ginny')} className="self-start border border-[#3F3F46] rounded-xl px-3 py-2 mt-2" accessibilityLabel="Select Ginny">
                <Text className="text-gray-200 text-sm">🧙 Ginny</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-start mb-4">
            <Feather name="clock" size={23} color="#A1A1AA" className="w-10 mt-4" />
            <View className="flex-1 bg-[#29292F] border border-[#3F3F46] rounded-xl px-4 py-4 flex-row justify-between">
              <Text className="text-gray-200 text-base">Today (Day 4)</Text>
              <Text className="text-gray-200 text-base">6 am</Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <Feather name="align-left" size={23} color="#A1A1AA" className="w-10 mt-4" />
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Add description (optional)"
              placeholderTextColor="#A1A1AA"
              className="flex-1 bg-[#29292F] border border-[#3F3F46] rounded-xl px-4 py-4 text-white text-base min-h-20"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
