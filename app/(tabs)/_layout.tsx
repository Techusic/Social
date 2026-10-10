import { Tabs } from 'expo-router';
import { Foundation, Feather, Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useNotificationStore } from '../../stores/notificationStore';

export default function TabLayout() {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.reduce((count, item) => count + (item.read ? 0 : 1), 0);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          borderTopWidth: 1,
          borderTopColor: '#1F1F1F',
          height: 85,
          paddingBottom: 30,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#E5E7EB',
        tabBarInactiveTintColor: '#4B5563',
        tabBarShowLabel: false,
      }}>
      
      {/* 1. Feed Tab (Uses Home Icon) */}
      <Tabs.Screen 
        name="feed" 
        options={{ 
          tabBarIcon: ({ color }) => <Foundation name="home" size={28} color={color} /> 
        }} 
      />
      
      {/* 2. Goals Tab (Uses Target Icon) */}
      <Tabs.Screen 
        name="goals" 
        options={{ 
          tabBarIcon: ({ color }) => <Feather name="target" size={26} color={color} /> 
        }} 
      />
      
      {/* 3. Messages Tab */}
      <Tabs.Screen 
        name="chat" 
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={26} color={color} /> 
        }} 
      />
      
      {/* 4. Notifications Tab */}
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <Ionicons name="notifications" size={26} color={color} />
              {unreadCount > 0 && <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0A0A0A]" />}
            </View>
          ) 
        }} 
      />
      
      {/* 5. Profile Tab */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="person" size={26} color={color} /> 
        }} 
      />
    </Tabs>
  );
}