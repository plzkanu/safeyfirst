import React from 'react';
import { View, ViewProps } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/components/useColorScheme';

interface SafeLayoutProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  statusBarStyle?: 'auto' | 'inverted' | 'light' | 'dark';
}

export default function SafeLayout({
  children,
  className = '',
  statusBarStyle,
  ...props
}: SafeLayoutProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // StatusBar 스타일 결정
  const finalStatusBarStyle = statusBarStyle || (isDark ? 'light' : 'dark');

  return (
    <>
      <StatusBar style={finalStatusBarStyle} />
      <View
        className={`flex-1 bg-white dark:bg-gray-900 ${className}`}
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
        {...props}
      >
        <View className="flex-1 px-4">
          {children}
        </View>
      </View>
    </>
  );
}

