import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface SafetyIndexCardProps {
  index: number; // 0-100
  trend?: 'up' | 'down' | 'stable';
}

export default function SafetyIndexCard({ index, trend = 'stable' }: SafetyIndexCardProps) {
  const getIndexColor = () => {
    if (index >= 80) return 'text-success-600 dark:text-success-400';
    if (index >= 60) return 'text-warning-600 dark:text-warning-400';
    return 'text-danger-600 dark:text-danger-400';
  };

  const getIndexBgColor = () => {
    if (index >= 80) return 'bg-success-50 dark:bg-success-900/20';
    if (index >= 60) return 'bg-warning-50 dark:bg-warning-900/20';
    return 'bg-danger-50 dark:bg-danger-900/20';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={20} color="#22c55e" />;
      case 'down':
        return <TrendingDown size={20} color="#ef4444" />;
      default:
        return <Minus size={20} color="#6b7280" />;
    }
  };

  return (
    <View className={`${getIndexBgColor()} p-5 rounded-2xl`}>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-semibold text-gray-800 dark:text-gray-200">
          오늘의 안전 지수
        </Text>
        {getTrendIcon()}
      </View>
      <View className="flex-row items-baseline">
        <Text className={`text-5xl font-bold ${getIndexColor()} mr-2`}>
          {index}
        </Text>
        <Text className="text-xl text-gray-600 dark:text-gray-400">/ 100</Text>
      </View>
      <View className="mt-3">
        <View className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
          <View
            className={`h-full ${index >= 80 ? 'bg-success-500' : index >= 60 ? 'bg-warning-500' : 'bg-danger-500'}`}
            style={{ width: `${index}%` }}
          />
        </View>
      </View>
      <Text className="text-xs text-gray-600 dark:text-gray-400 mt-2">
        {index >= 80
          ? '우수한 안전 상태입니다'
          : index >= 60
          ? '양호한 안전 상태입니다'
          : '주의가 필요한 안전 상태입니다'}
      </Text>
    </View>
  );
}

