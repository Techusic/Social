import { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type Character = { id: string; name: string; handle: string; bio: string; avatar: string; selected?: boolean };

const characters: Character[] = [
  { id: 'ron', name: 'ron weasley', handle: '@theunderratedweasley', bio: 'Sixth in line for everything. Punchlines credit to me.', avatar: 'https://i.pravatar.cc/150?u=ron' },
  { id: 'cedric', name: 'Cedric Diggory', handle: '@CedricDiggory', bio: 'Hufflepuff prefect and Quidditch captain. Triwizard champion. Seeker of fairness and justice.', avatar: 'https://i.pravatar.cc/150?u=cedric' },
  { id: 'ginny', name: 'Ginny Weasley', handle: '@thebestweasley', bio: 'The only Weasley who’s always right.', avatar: 'https://i.pravatar.cc/150?u=ginny', selected: true },
  { id: 'dobby', name: 'Dobby', handle: '@DobbytheFree', bio: 'Free elf. Friend of Harry Potter. Lover of socks.', avatar: 'https://i.pravatar.cc/150?u=dobby' },
  { id: 'hermione', name: 'Hermione Granger', handle: '@HermioneGranger', bio: 'brightest witch of her age. hogwarts alum. advocate for magical creature rights.', avatar: 'https://i.pravatar.cc/150?u=hermione' },
  { id: 'harry', name: 'Harry Potter', handle: '@Potter', bio: 'The Boy who Lived ✧ magical lineage ✧', avatar: 'https://i.pravatar.cc/150?u=harry' },
];

export default function AddCharacter() {
  const [query, setQuery] = useState('');
  const [customTab, setCustomTab] = useState(false);
  const filteredCharacters = useMemo(
    () => characters.filter((character) => `${character.name} ${character.handle}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <SafeAreaView className="flex-1 bg-[#19191B]" edges={['top']}>
      <View className="flex-row items-center px-7 pt-5 pb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-5" accessibilityLabel="Back">
          <Feather name="arrow-left" size={30} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-2xl font-semibold">Add a character to your world</Text>
      </View>

      <View className="px-7">
        <View className="bg-[#29292F] border border-[#4A4A52] flex-row items-center px-5 py-4 rounded-2xl mb-6">
          <Feather name="search" size={25} color="#A1A1AA" />
          <TextInput value={query} onChangeText={setQuery} placeholder={customTab ? 'Search my characters' : 'Search all characters'} placeholderTextColor="#A1A1AA" className="flex-1 text-gray-200 ml-4 text-xl" />
        </View>

        <View className="flex-row border-b border-[#303035]">
          <TouchableOpacity onPress={() => setCustomTab(false)} className={`flex-1 items-center pb-4 ${!customTab ? 'border-b-4 border-blue-400' : ''}`}>
            <Text className={`text-xl ${customTab ? 'text-gray-400' : 'text-blue-400'}`}>All characters</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCustomTab(true)} className={`flex-1 items-center pb-4 ${customTab ? 'border-b-4 border-blue-400' : ''}`}>
            <Text className={`text-xl ${customTab ? 'text-blue-400' : 'text-gray-400'}`}>Custom characters</Text>
          </TouchableOpacity>
        </View>
      </View>

      {customTab ? (
        <View className="flex-1 items-center pt-24 px-8">
          <MaterialCommunityIcons name="account-group" size={65} color="#A1A1AA" />
          <Text className="text-gray-400 text-xl mt-7 text-center">You don&apos;t have any custom characters</Text>
          <TouchableOpacity onPress={() => router.push('/create-character')} className="bg-[#4A9AE8] rounded-full px-10 py-5 flex-row items-center mt-8">
            <MaterialCommunityIcons name="account-plus" size={28} color="white" />
            <Text className="text-white text-xl ml-4">Create custom character</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1 px-7" showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center gap-3 py-5">
            <TouchableOpacity className="bg-[#4A9AE8] rounded-full px-6 py-3 flex-row items-center"><Text className="text-white text-lg">⚡ Harry Potter</Text></TouchableOpacity>
            <TouchableOpacity className="bg-[#29292F] rounded-full px-6 py-3"><Text className="text-gray-300 text-lg">🌍 All worlds</Text></TouchableOpacity>
          </View>
          {filteredCharacters.map((character) => (
            <TouchableOpacity key={character.id} className="flex-row items-start py-5 border-b border-[#303035]" accessibilityLabel={`Add ${character.name}`}>
              <Image source={{ uri: character.avatar }} className="w-20 h-20 rounded-full mr-6" />
              <View className="flex-1 pr-2">
                <Text className="text-white text-2xl">{character.name}</Text>
                <Text className="text-gray-500 text-xl mt-1">{character.handle}</Text>
                <Text className="text-gray-400 text-lg leading-7 mt-2" numberOfLines={2}>{character.bio}</Text>
              </View>
              {character.selected && <View className="w-12 h-12 rounded-full bg-[#25649A] items-center justify-center mt-5"><Ionicons name="checkmark" size={30} color="#A8D8FF" /></View>}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
