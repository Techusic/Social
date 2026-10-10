import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function Store() {
  const buy = (label: string) => Alert.alert(label, 'Store purchases are local-only in this prototype.');
  return (
    <SafeAreaView className="flex-1 bg-[#121214]" edges={['top', 'bottom']}>
      <View className="flex-row items-center px-5 py-4 border-b border-gray-800"><TouchableOpacity onPress={() => router.back()}><Feather name="arrow-left" size={26} color="white" /></TouchableOpacity><Text className="text-white text-xl font-bold ml-5">Store</Text></View>
      <ScrollView className="px-5 pt-5">
        <View className="bg-[#29221A] rounded-2xl p-5 border border-yellow-700/40"><Text className="text-yellow-400 font-bold">Energy</Text><Text className="text-white text-3xl font-bold mt-2">9,999</Text><Text className="text-gray-400 mt-1">Use energy to post, message, and start activities.</Text></View>
        {['Refill 8 energy', 'Status Plus trial', 'Unlock a power-up'].map((item) => <TouchableOpacity key={item} onPress={() => buy(item)} className="bg-[#1C1C1E] rounded-2xl border border-gray-800 p-5 mt-4"><Text className="text-white font-semibold text-base">{item}</Text><Text className="text-blue-400 text-sm mt-2">Available in prototype</Text></TouchableOpacity>)}
      </ScrollView>
    </SafeAreaView>
  );
}
