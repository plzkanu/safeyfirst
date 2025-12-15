import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, ClipboardCheck, Bell } from 'lucide-react-native';
import { NotificationItem, NotificationStatus, NotificationType } from '@/types/notification';

interface NotificationCardProps {
  item: NotificationItem;
  onPress?: (item: NotificationItem) => void;
}

export default function NotificationCard({ item, onPress }: NotificationCardProps) {
  const getStatusConfig = (status: NotificationStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          label: '처리중',
          color: '#f59e0b',
          bgColor: 'bg-warning-50 dark:bg-warning-900/20',
          borderColor: 'border-warning-300 dark:border-warning-700',
          textColor: 'text-warning-700 dark:text-warning-400',
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          label: '완료',
          color: '#22c55e',
          bgColor: 'bg-success-50 dark:bg-success-900/20',
          borderColor: 'border-success-300 dark:border-success-700',
          textColor: 'text-success-700 dark:text-success-400',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          label: '취소됨',
          color: '#ef4444',
          bgColor: 'bg-danger-50 dark:bg-danger-900/20',
          borderColor: 'border-danger-300 dark:border-danger-700',
          textColor: 'text-danger-700 dark:text-danger-400',
        };
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'report':
        return FileText;
      case 'inspection':
        return ClipboardCheck;
      case 'alert':
        return AlertCircle;
      case 'announcement':
        return Bell;
    }
  };

  const statusConfig = getStatusConfig(item.status);
  const StatusIcon = statusConfig.icon;
  const TypeIcon = getTypeIcon(item.type);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '오늘';
    } else if (diffDays === 1) {
      return '어제';
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress?.(item)}
      activeOpacity={0.6}
      className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-2 rounded-xl p-4 mb-3 shadow-sm`}
    >
      <View className="flex-row items-start">
        {/* 타입 아이콘 */}
        <View className="mr-3 mt-1">
          <View className="bg-white dark:bg-gray-700 p-2 rounded-lg">
            <TypeIcon size={20} color="#6b7280" />
          </View>
        </View>

        {/* 내용 */}
        <View className="flex-1">
          {/* 상태 배지와 제목 */}
          <View className="flex-row items-center mb-2">
            <View
              className={`${statusConfig.bgColor} ${statusConfig.borderColor} border px-2 py-1 rounded-full flex-row items-center mr-2`}
            >
              <StatusIcon size={12} color={statusConfig.color} />
              <Text className={`${statusConfig.textColor} text-xs font-semibold ml-1`}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* 제목 */}
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {item.title}
          </Text>

          {/* 설명 */}
          {item.description && (
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2" numberOfLines={2}>
              {item.description}
            </Text>
          )}

          {/* 날짜 */}
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(item.date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

