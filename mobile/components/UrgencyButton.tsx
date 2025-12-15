import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react-native';
import { UrgencyLevel, URGENCY_LABELS } from '@/types/report';

interface UrgencyButtonProps {
  level: UrgencyLevel;
  selected: boolean;
  onSelect: (level: UrgencyLevel) => void;
}

export default function UrgencyButton({
  level,
  selected,
  onSelect,
}: UrgencyButtonProps) {
  const getConfig = () => {
    switch (level) {
      case 'high':
        return {
          icon: AlertTriangle,
          color: '#ef4444',
          bgColor: selected
            ? 'bg-danger-500'
            : 'bg-danger-50 dark:bg-danger-900/20',
          borderColor: selected
            ? 'border-danger-600'
            : 'border-danger-300 dark:border-danger-700',
          textColor: selected ? 'text-white' : 'text-danger-700 dark:text-danger-400',
        };
      case 'medium':
        return {
          icon: AlertCircle,
          color: '#f59e0b',
          bgColor: selected
            ? 'bg-warning-500'
            : 'bg-warning-50 dark:bg-warning-900/20',
          borderColor: selected
            ? 'border-warning-600'
            : 'border-warning-300 dark:border-warning-700',
          textColor: selected ? 'text-white' : 'text-warning-700 dark:text-warning-400',
        };
      case 'low':
        return {
          icon: Info,
          color: '#3b82f6',
          bgColor: selected
            ? 'bg-secondary-500'
            : 'bg-secondary-50 dark:bg-secondary-900/20',
          borderColor: selected
            ? 'border-secondary-600'
            : 'border-secondary-300 dark:border-secondary-700',
          textColor: selected ? 'text-white' : 'text-secondary-700 dark:text-secondary-400',
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <TouchableOpacity
      onPress={() => onSelect(level)}
      activeOpacity={0.6}
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-4 flex-1 mx-1 shadow-sm`}
    >
      <View className="items-center">
        <IconComponent
          size={24}
          color={selected ? '#ffffff' : config.color}
        />
        <Text className={`${config.textColor} font-semibold text-base mt-2`}>
          {URGENCY_LABELS[level]}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

