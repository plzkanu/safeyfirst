import React, { useState, useMemo } from 'react';
import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import SafeLayout from '@/components/SafeLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import SafetyIndexCard from '@/components/SafetyIndexCard';
import TodoSummaryCard from '@/components/TodoSummaryCard';
import NoticeBanner from '@/components/NoticeBanner';
import RecentIssuesCard from '@/components/RecentIssuesCard';
import { Bell, ChevronRight } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { getRecentReports, notifications } = useNotifications();

  // 최근 신고 내역 가져오기
  const recentIssues = useMemo(() => getRecentReports(3), [getRecentReports]);

  // Mock 데이터
  const [safetyIndex] = useState(85);
  const [safetyTrend] = useState<'up' | 'down' | 'stable'>('up');

  const [todos] = useState([
    {
      id: '1',
      title: '발전소 A구역 정기 점검',
      type: '정기 점검',
      dueDate: '2024-12-15',
      priority: 'high' as const,
    },
    {
      id: '2',
      title: '안전 장비 점검',
      type: '설비 점검',
      dueDate: '2024-12-16',
      priority: 'medium' as const,
    },
    {
      id: '3',
      title: '비상 대응 훈련',
      type: '교육',
      dueDate: '2024-12-18',
      priority: 'low' as const,
    },
    {
      id: '4',
      title: '화재 안전 점검',
      type: '안전 점검',
      dueDate: '2024-12-20',
      priority: 'high' as const,
    },
  ]);

  const [notices] = useState([
    {
      id: '1',
      title: '겨울철 안전 관리 강화 안내',
      date: '2024-12-12',
      isImportant: true,
    },
    {
      id: '2',
      title: '신규 안전 규정 시행 공지',
      date: '2024-12-10',
      isImportant: false,
    },
    {
      id: '3',
      title: '연말 안전 점검 일정 안내',
      date: '2024-12-08',
      isImportant: false,
    },
  ]);

  return (
    <SafeLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-6">
          {/* 헤더 */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              대시보드
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              {user?.name}님, 안전 관리 시스템에 오신 것을 환영합니다
            </Text>
          </View>

          {/* 오늘의 안전 지수 카드 */}
          <View className="mb-6">
            <SafetyIndexCard index={safetyIndex} trend={safetyTrend} />
          </View>

          {/* 그리드 레이아웃: 통계 카드들 */}
          <View className="mb-6">
            <View className="flex-row mb-3">
              <View className="flex-1 mr-2">
                <View className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl">
                  <Text className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    전체 활동
                  </Text>
                  <Text className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {notifications.length}
                  </Text>
                </View>
              </View>
              <View className="flex-1 ml-2">
                <View className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-xl">
                  <Text className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    오늘 활동
                  </Text>
                  <Text className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                    {notifications.filter((n) => {
                      const today = new Date();
                      const notificationDate = new Date(n.date);
                      return (
                        today.getDate() === notificationDate.getDate() &&
                        today.getMonth() === notificationDate.getMonth() &&
                        today.getFullYear() === notificationDate.getFullYear()
                      );
                    }).length}
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex-row">
              <View className="flex-1 mr-2">
                <View className="bg-success-50 dark:bg-success-900/20 p-4 rounded-xl">
                  <Text className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    완료된 점검
                  </Text>
                  <Text className="text-3xl font-bold text-success-600 dark:text-success-400">
                    {notifications.filter((n) => n.status === 'completed').length}
                  </Text>
                </View>
              </View>
              <View className="flex-1 ml-2">
                <View className="bg-warning-50 dark:bg-warning-900/20 p-4 rounded-xl">
                  <Text className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    대기 중
                  </Text>
                  <Text className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                    {notifications.filter((n) => n.status === 'pending').length}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 최근 이슈 */}
          <View className="mb-6">
            <RecentIssuesCard issues={recentIssues} maxItems={3} />
          </View>

          {/* 나의 할 일 (점검 예정) */}
          <View className="mb-6">
            <TodoSummaryCard todos={todos} maxItems={3} />
          </View>

          {/* 알림 센터 / 신고 내역 */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex-row items-center justify-between shadow-sm"
              activeOpacity={0.6}
            >
              <View className="flex-row items-center flex-1">
                <View className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg mr-3">
                  <Bell size={24} color="#ff8c00" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    알림 센터
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    신고 내역 및 알림 확인
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* 공지사항 배너 */}
          <View>
            <NoticeBanner notices={notices} />
          </View>
        </View>
      </ScrollView>
    </SafeLayout>
  );
}
