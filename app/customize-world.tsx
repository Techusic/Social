import { useState } from 'react';
import { Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useActivityLogStore } from '../stores/activityLogStore';
import { useWorldStore } from '../stores/worldStore';

type Panel = 'difficulty' | 'madness' | 'multiplayer' | 'overview' | 'characters' | 'stories' | 'news' | null;

function SettingRow({
  icon,
  title,
  value,
  premium,
  open,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  value?: string;
  premium?: boolean;
  open: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-4 border-b border-[#38383E]" accessibilityLabel={`Configure ${title}`}>
      <Feather name={icon} size={22} color="#A1A1AA" />
      <Text className="text-white text-base ml-3 flex-1">{title}</Text>
      {premium && <View className="bg-[#B64BEB] rounded-md px-1.5 py-1 mr-3"><Feather name="star" size={13} color="white" /></View>}
      {!!value && <Text className="text-gray-400 text-base mr-3">{value}</Text>}
      <Feather name={open ? 'chevron-down' : 'chevron-right'} size={22} color="#A1A1AA" />
    </TouchableOpacity>
  );
}

function ChoiceRow({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className={`rounded-xl px-4 py-3 mr-2 mb-2 border ${selected ? 'bg-[#263F68] border-blue-400' : 'bg-[#29292D] border-[#45454D]'}`}>
      <Text className={selected ? 'text-blue-200 font-semibold' : 'text-gray-300'}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function CustomizeWorld() {
  const record = useActivityLogStore((state) => state.record);
  const activeWorld = useWorldStore((state) => state.worlds.find((world) => world.id === state.activeWorldId));
  const updateWorld = useWorldStore((state) => state.updateWorld);
  const updateSettings = useWorldStore((state) => state.updateSettings);
  const worldName = activeWorld?.name ?? '';
  const description = activeWorld?.description ?? '';
  const difficulty = activeWorld?.settings.difficulty ?? 'Normal';
  const madnessScale = activeWorld?.settings.madnessScale ?? 'Normal';
  const multiplayer = activeWorld?.settings.multiplayer ?? false;
  const universeStories = activeWorld?.settings.universeStories ?? true;
  const newsAccounts = activeWorld?.settings.newsAccounts ?? true;
  const worldTone = activeWorld?.settings.worldTone ?? '';
  const npcGuidance = activeWorld?.settings.npcGuidance ?? '';
  const newsTone = activeWorld?.settings.newsTone ?? '';
  const [panel, setPanel] = useState<Panel>(null);

  const togglePanel = (next: Exclude<Panel, null>) => setPanel((current) => current === next ? null : next);

  const save = () => {
    if (!worldName.trim()) {
      Alert.alert('Add a world name', 'Your world needs a name before it can be saved.');
      return;
    }
    record({
      kind: 'world',
      title: 'World customized',
      detail: `${worldName.trim()} · ${difficulty} difficulty · ${madnessScale} madness scale`,
    });
    updateWorld({ name: worldName.trim(), description });
    updateSettings({ difficulty, madnessScale, multiplayer, universeStories, newsAccounts, worldTone, npcGuidance, newsTone });
    Alert.alert('World updated', 'Your world settings have been saved.');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#18171B]" edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Back">
          <Feather name="arrow-left" size={28} color="#E4E4E7" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Customize World</Text>
        <TouchableOpacity onPress={save} accessibilityLabel="Save world settings">
          <Text className="text-blue-400 font-semibold">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text className="text-gray-400 text-sm mb-3 mt-2">Gameplay</Text>
        <View className="bg-[#252429] border border-[#49484F] rounded-3xl px-5">
          <SettingRow icon="grid" title="Difficulty mode" value={difficulty} premium open={panel === 'difficulty'} onPress={() => togglePanel('difficulty')} />
          {panel === 'difficulty' && (
            <View className="py-4 border-b border-[#38383E]">
              <Text className="text-gray-400 text-sm mb-3">How demanding should choices and consequences feel?</Text>
              <View className="flex-row flex-wrap">
                {['Relaxed', 'Normal', 'Hard'].map((item) => <ChoiceRow key={item} label={item} selected={difficulty === item} onPress={() => updateSettings({ difficulty: item as typeof difficulty })} />)}
              </View>
            </View>
          )}
          <SettingRow icon="activity" title="Madness Scale" value={madnessScale} premium open={panel === 'madness'} onPress={() => togglePanel('madness')} />
          {panel === 'madness' && (
            <View className="py-4 border-b border-[#38383E]">
              <Text className="text-gray-400 text-sm mb-3">Control how unpredictable the world becomes.</Text>
              <View className="flex-row flex-wrap">
                {['Low', 'Normal', 'Chaotic'].map((item) => <ChoiceRow key={item} label={item} selected={madnessScale === item} onPress={() => updateSettings({ madnessScale: item as typeof madnessScale })} />)}
              </View>
            </View>
          )}
          <SettingRow icon="users" title="Multiplayer" open={panel === 'multiplayer'} onPress={() => togglePanel('multiplayer')} />
          {panel === 'multiplayer' && (
            <View className="py-4">
              <View className="flex-row items-center">
                <View className="flex-1 pr-4">
                  <Text className="text-white font-semibold">Invite other players</Text>
                  <Text className="text-gray-500 text-sm mt-1">Let friends participate in this world.</Text>
                </View>
                <Switch value={multiplayer} onValueChange={(value) => updateSettings({ multiplayer: value })} trackColor={{ false: '#52525B', true: '#2563EB' }} thumbColor="#F4F4F5" />
              </View>
              {multiplayer && <TouchableOpacity className="bg-blue-500 rounded-xl py-3 items-center mt-4"><Text className="text-white font-semibold">Invite players</Text></TouchableOpacity>}
            </View>
          )}
        </View>

        <Text className="text-gray-400 text-sm mb-3 mt-7">My world</Text>
        <View className="bg-[#252429] border border-[#49484F] rounded-3xl px-5">
          <SettingRow icon="globe" title="World overview" open={panel === 'overview'} onPress={() => togglePanel('overview')} />
          {panel === 'overview' && (
            <View className="py-4 border-b border-[#38383E]">
              <Text className="text-gray-300 text-sm mb-2">World name</Text>
              <TextInput value={worldName} onChangeText={(value) => updateWorld({ name: value })} placeholder="World name" placeholderTextColor="#71717A" className="bg-[#29292D] border border-[#45454D] rounded-xl px-4 py-3 text-white mb-4" />
              <Text className="text-gray-300 text-sm mb-2">Description</Text>
              <TextInput value={description} onChangeText={(value) => updateWorld({ description: value })} multiline textAlignVertical="top" placeholder="What is this world about?" placeholderTextColor="#71717A" className="bg-[#29292D] border border-[#45454D] rounded-xl px-4 py-3 text-white min-h-24 mb-4" />
              <Text className="text-gray-300 text-sm mb-2">Story tone</Text>
              <TextInput value={worldTone} onChangeText={(value) => updateSettings({ worldTone: value })} placeholder="Story tone" placeholderTextColor="#71717A" className="bg-[#29292D] border border-[#45454D] rounded-xl px-4 py-3 text-white" />
            </View>
          )}
          <SettingRow icon="users" title="Characters & NPCs" open={panel === 'characters'} onPress={() => togglePanel('characters')} />
          {panel === 'characters' && (
            <View className="py-4 border-b border-[#38383E]">
              <Text className="text-gray-400 text-sm leading-5 mb-3">Characters shape the feed, relationships, messages, and world events.</Text>
              <TextInput value={npcGuidance} onChangeText={(value) => updateSettings({ npcGuidance: value })} multiline textAlignVertical="top" placeholder="Character guidance" placeholderTextColor="#71717A" className="bg-[#29292D] border border-[#45454D] rounded-xl px-4 py-3 text-white min-h-24 mb-4" />
              <TouchableOpacity onPress={() => router.push('/add-character')} className="bg-[#3B82F6] rounded-xl py-3 items-center" accessibilityLabel="Manage characters and NPCs">
                <Text className="text-white font-semibold">Manage characters</Text>
              </TouchableOpacity>
            </View>
          )}
          <SettingRow icon="globe" title="Universe Stories" value={universeStories ? 'On' : 'Off'} premium open={panel === 'stories'} onPress={() => togglePanel('stories')} />
          {panel === 'stories' && (
            <View className="py-4 border-b border-[#38383E]">
              <View className="flex-row items-center">
                <View className="flex-1 pr-4">
                  <Text className="text-white font-semibold">Enable universe stories</Text>
                  <Text className="text-gray-500 text-sm mt-1">Allow larger world events and connected story arcs to appear.</Text>
                </View>
                <Switch value={universeStories} onValueChange={(value) => updateSettings({ universeStories: value })} trackColor={{ false: '#52525B', true: '#2563EB' }} thumbColor="#F4F4F5" />
              </View>
            </View>
          )}
          <SettingRow icon="file-text" title="News accounts" value={newsAccounts ? 'On' : 'Off'} open={panel === 'news'} onPress={() => togglePanel('news')} />
          {panel === 'news' && (
            <View className="py-4">
              <View className="flex-row items-center mb-4">
                <View className="flex-1 pr-4">
                  <Text className="text-white font-semibold">World news accounts</Text>
                  <Text className="text-gray-500 text-sm mt-1">Let news accounts publish rumors and updates.</Text>
                </View>
                <Switch value={newsAccounts} onValueChange={(value) => updateSettings({ newsAccounts: value })} trackColor={{ false: '#52525B', true: '#2563EB' }} thumbColor="#F4F4F5" />
              </View>
              {newsAccounts && (
                <>
                  <Text className="text-gray-300 text-sm mb-2">News style</Text>
                  <View className="flex-row flex-wrap">
                    {['Gossip and breaking news', 'Measured reporting', 'Chaotic headlines'].map((item) => <ChoiceRow key={item} label={item} selected={newsTone === item} onPress={() => updateSettings({ newsTone: item })} />)}
                  </View>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
