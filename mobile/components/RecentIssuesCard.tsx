import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { AlertCircle, ChevronRight } from 'lucide-react-native';
import NotificationCard from '@/components/NotificationCard';
import { NotificationItem } from '@/types/notification';

interface RecentIssuesCardProps {
  issues: NotificationItem[];
  maxItems?: number;
}

export default function RecentIssuesCard({ issues, maxItems = 3 }: RecentIssuesCardProps) {
  const displayIssues = issues.slice(0, maxItems);

  if (displayIssues.length === 0) {
    return (
      <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <AlertCircle size={20} color="#ff8c00" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
              최근 이슈
            </Text>
          </View>
        </View>
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          최근 신고 내역이 없습니다
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <AlertCircle size={20} color="#ff8c00" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
            최근 이슈
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          className="flex-row items-center"
          activeOpacity={0.6}
        >
          <Text className="text-sm text-primary-600 dark:text-primary-400 mr-1">
            전체보기
          </Text>
          <ChevronRight size={16} color="#ff8c00" />
        </TouchableOpacity>
      </View>
      <View>
        {displayIssues.map((issue) => (
          <View key={issue.id} className="mb-2">
            <NotificationCard item={issue} />
          </View>
        ))}
      </View>
    </View>
  );
}

