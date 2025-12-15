import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Bell, ChevronRight } from 'lucide-react-native';

interface Notice {
  id: string;
  title: string;
  date: string;
  isImportant?: boolean;
}

interface NoticeBannerProps {
  notices: Notice[];
}

export default function NoticeBanner({ notices }: NoticeBannerProps) {
  if (notices.length === 0) {
    return null;
  }

  const latestNotice = notices[0];

  return (
    <TouchableOpacity
      className={`${
        latestNotice.isImportant
          ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800'
          : 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800'
      } p-4 rounded-xl border shadow-sm`}
      activeOpacity={0.6}
    >
      <View className="flex-row items-start">
        <View
          className={`${
            latestNotice.isImportant ? 'bg-danger-500' : 'bg-secondary-500'
          } p-2 rounded-lg mr-3`}
        >
          <Bell size={20} color="#ffffff" />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            {latestNotice.isImportant && (
              <View className="bg-danger-500 px-2 py-0.5 rounded mr-2">
                <Text className="text-xs font-bold text-white">중요</Text>
              </View>
            )}
            <Text className="text-xs text-gray-600 dark:text-gray-400">
              {latestNotice.date}
            </Text>
          </View>
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {latestNotice.title}
          </Text>
          {notices.length > 1 && (
            <Text className="text-xs text-gray-600 dark:text-gray-400">
              외 {notices.length - 1}개의 공지사항이 있습니다
            </Text>
          )}
        </View>
        <ChevronRight size={20} color="#6b7280" />
      </View>
    </TouchableOpacity>
  );
}

