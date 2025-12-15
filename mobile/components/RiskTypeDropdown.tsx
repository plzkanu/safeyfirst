import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { RiskType, RiskTypeOption, RISK_TYPES } from '@/types/report';

interface RiskTypeDropdownProps {
  selected: RiskType | null;
  onSelect: (type: RiskType) => void;
}

export default function RiskTypeDropdown({
  selected,
  onSelect,
}: RiskTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = RISK_TYPES.find((type) => type.id === selected);

  const handleSelect = (type: RiskType) => {
    onSelect(type);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 flex-row items-center justify-between"
        activeOpacity={0.6}
      >
        <Text
          className={`flex-1 ${
            selected
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {selectedOption ? selectedOption.label : '위험 유형을 선택하세요'}
        </Text>
        <ChevronDown
          size={20}
          color="#9ca3af"
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-t-3xl max-h-[80%]"
          >
            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                위험 유형 선택
              </Text>
            </View>
            <ScrollView className="max-h-[400px]">
              {RISK_TYPES.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleSelect(option.id)}
                  className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700"
                  activeOpacity={0.6}
                >
                  <Text className="text-base text-gray-900 dark:text-white">
                    {option.label}
                  </Text>
                  {selected === option.id && (
                    <Check size={20} color="#ff8c00" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

