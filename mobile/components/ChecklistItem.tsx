import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle2, XCircle, Clock } from 'lucide-react-native';
import { ChecklistStatus } from '@/types/inspection';

interface ChecklistItemProps {
  id: string;
  title: string;
  description?: string;
  status: ChecklistStatus;
  onStatusChange: (id: string, status: ChecklistStatus) => void;
}

export default function ChecklistItem({
  id,
  title,
  description,
  status,
  onStatusChange,
}: ChecklistItemProps) {
  const handleStatusChange = (newStatus: ChecklistStatus) => {
    // 순환: null -> checked -> unchecked -> pending -> null
    if (status === null) {
      onStatusChange(id, 'checked');
    } else if (status === 'checked') {
      onStatusChange(id, 'unchecked');
    } else if (status === 'unchecked') {
      onStatusChange(id, 'pending');
    } else {
      onStatusChange(id, null);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'checked':
        return {
          icon: CheckCircle2,
          color: '#22c55e',
          bgColor: 'bg-success-50 dark:bg-success-900/20',
          borderColor: 'border-success-300 dark:border-success-700',
          text: '정상',
        };
      case 'unchecked':
        return {
          icon: XCircle,
          color: '#ef4444',
          bgColor: 'bg-danger-50 dark:bg-danger-900/20',
          borderColor: 'border-danger-300 dark:border-danger-700',
          text: '이상',
        };
      case 'pending':
        return {
          icon: Clock,
          color: '#f59e0b',
          bgColor: 'bg-warning-50 dark:bg-warning-900/20',
          borderColor: 'border-warning-300 dark:border-warning-700',
          text: '보류',
        };
      default:
        return {
          icon: null,
          color: '#9ca3af',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-300 dark:border-gray-700',
          text: '미확인',
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <TouchableOpacity
      onPress={() => handleStatusChange(status)}
      activeOpacity={0.6}
      className={`${config.bgColor} ${config.borderColor} border-2 p-4 rounded-xl mb-3 shadow-sm`}
    >
      <View className="flex-row items-start">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </Text>
          {description && (
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </Text>
          )}
        </View>
        <View className="items-center">
          {IconComponent && (
            <IconComponent size={24} color={config.color} />
          )}
          <Text
            className="text-xs font-medium mt-1"
            style={{ color: config.color }}
          >
            {config.text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

