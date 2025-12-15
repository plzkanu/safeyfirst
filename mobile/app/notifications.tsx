import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import SafeLayout from '@/components/SafeLayout';
import NotificationCard from '@/components/NotificationCard';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, Filter } from 'lucide-react-native';
import { NotificationItem, NotificationStatus } from '@/types/notification';

export default function NotificationsScreen() {
  const { notifications } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<NotificationStatus | 'all'>('all');

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') {
      return notifications;
    }
    return notifications.filter((item) => item.status === filter);
  }, [notifications, filter]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Context에서 데이터를 가져오므로 새로고침은 단순히 상태만 업데이트
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const handleNotificationPress = (item: NotificationItem) => {
    // 상세 화면으로 이동 (추후 구현)
    console.log('Notification pressed:', item);
  };

  const getFilterCount = (status: NotificationStatus | 'all') => {
    if (status === 'all') {
      return notifications.length;
    }
    return notifications.filter((item) => item.status === status).length;
  };

  return (
    <SafeLayout>
      <View className="flex-1">
        {/* 헤더 */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <Bell size={24} color="#ff8c00" />
              <Text className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
                알림 센터
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg"
              activeOpacity={0.6}
            >
              <Text className="text-sm text-gray-700 dark:text-gray-300 font-medium">닫기</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            신고 내역 및 알림을 확인하세요
          </Text>
        </View>

        {/* 필터 버튼 */}
        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setFilter('all')}
            className={`flex-1 mr-2 py-2 px-3 rounded-lg border-2 ${
              filter === 'all'
                ? 'bg-primary-500 border-primary-600'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                filter === 'all' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              전체 ({getFilterCount('all')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('pending')}
            className={`flex-1 mx-1 py-2 px-3 rounded-lg border-2 ${
              filter === 'pending'
                ? 'bg-warning-500 border-warning-600'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                filter === 'pending' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              처리중 ({getFilterCount('pending')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilter('completed')}
            className={`flex-1 ml-2 py-2 px-3 rounded-lg border-2 ${
              filter === 'completed'
                ? 'bg-success-500 border-success-600'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
            }`}
            activeOpacity={0.7}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                filter === 'completed' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              완료 ({getFilterCount('completed')})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 리스트 */}
        {filteredNotifications.length > 0 ? (
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationCard item={item} onPress={handleNotificationPress} />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#ff8c00"
              />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            updateCellsBatchingPeriod={50}
            scrollEventThrottle={16}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Bell size={48} color="#9ca3af" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
              알림이 없습니다
            </Text>
          </View>
        )}
      </View>
    </SafeLayout>
  );
}

