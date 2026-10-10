import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Settings() {
  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top', 'bottom']}>
      <View className="flex-row items-center px-5 py-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back"><Feather name="arrow-left" size={26} color="white" /></TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-5">Settings</Text>
      </View>
      <ScrollView className="px-5 pt-5">
        <Text className="text-gray-500 text-xs uppercase tracking-widest mb-3">Preferences</Text>
        <View className="bg-[#1C1C1E] rounded-2xl border border-gray-800">
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-800"><Text className="text-white text-base">Notifications</Text><Switch value trackColor={{ true: '#3B82F6' }} /></View>
          <View className="flex-row items-center justify-between px-4 py-4"><Text className="text-white text-base">Reduce motion</Text><Switch trackColor={{ true: '#3B82F6' }} /></View>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('About Social', 'A local-first social simulation prototype.')} className="bg-[#1C1C1E] rounded-2xl border border-gray-800 px-4 py-4 mt-6" accessibilityLabel="About Social">
          <Text className="text-white text-base">About Social</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
