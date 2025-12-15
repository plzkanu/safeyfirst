import React from 'react';
import { Tabs } from 'expo-router';
import { Home, ClipboardCheck, FileText, Settings } from 'lucide-react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ff8c00', // Safety Orange (primary-500)
        tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af', // gray-500/gray-400
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff', // gray-900/white
          borderTopColor: isDark ? '#374151' : '#e5e7eb', // gray-700/gray-200
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
        },
        headerTintColor: isDark ? '#ffffff' : '#111827',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => <Home size={size || 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inspection"
        options={{
          title: '점검',
          tabBarIcon: ({ color, size }) => <ClipboardCheck size={size || 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: '신고',
          tabBarIcon: ({ color, size }) => <FileText size={size || 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color, size }) => <Settings size={size || 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
