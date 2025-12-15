import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import SafeLayout from '@/components/SafeLayout';
import ChecklistItem from '@/components/ChecklistItem';
import { ClipboardCheck, CheckCircle2 } from 'lucide-react-native';
import { InspectionCategory, ChecklistStatus } from '@/types/inspection';

// Mock 카테고리 데이터
const inspectionCategories: InspectionCategory[] = [
  {
    id: 'daily-equipment',
    name: '일일 장비 점검',
    description: '일일 장비 및 설비 점검 항목',
    checklistItems: [
      {
        id: '1',
        title: '발전기 상태 확인',
        description: '발전기 작동 상태 및 이상 여부 확인',
        status: null,
      },
      {
        id: '2',
        title: '냉각 시스템 점검',
        description: '냉각수 온도 및 순환 상태 확인',
        status: null,
      },
      {
        id: '3',
        title: '전기 배전반 점검',
        description: '전압, 전류, 누전 여부 확인',
        status: null,
      },
      {
        id: '4',
        title: '안전 밸브 작동 확인',
        description: '안전 밸브 정상 작동 여부 확인',
        status: null,
      },
      {
        id: '5',
        title: '배기 시스템 점검',
        description: '배기 팬 및 덕트 상태 확인',
        status: null,
      },
    ],
  },
  {
    id: 'fire-prevention',
    name: '화재 예방 점검',
    description: '화재 예방 및 소방 시설 점검 항목',
    checklistItems: [
      {
        id: '1',
        title: '소화기 위치 및 상태',
        description: '소화기 설치 위치 및 유효기간 확인',
        status: null,
      },
      {
        id: '2',
        title: '화재 감지기 작동 확인',
        description: '화재 감지기 정상 작동 여부 테스트',
        status: null,
      },
      {
        id: '3',
        title: '비상 출구 통로 점검',
        description: '비상 출구 통로 막힘 여부 확인',
        status: null,
      },
      {
        id: '4',
        title: '스프링클러 시스템',
        description: '스프링클러 헤드 및 배관 상태 확인',
        status: null,
      },
      {
        id: '5',
        title: '가연물 관리 상태',
        description: '가연물 보관 및 관리 상태 확인',
        status: null,
      },
    ],
  },
  {
    id: 'safety-equipment',
    name: '안전 장비 점검',
    description: '안전 보호구 및 장비 점검 항목',
    checklistItems: [
      {
        id: '1',
        title: '안전모 착용 상태',
        description: '작업자 안전모 착용 및 상태 확인',
        status: null,
      },
      {
        id: '2',
        title: '보호안경 및 마스크',
        description: '보호안경 및 마스크 상태 확인',
        status: null,
      },
      {
        id: '3',
        title: '안전화 착용 확인',
        description: '작업자 안전화 착용 여부 확인',
        status: null,
      },
      {
        id: '4',
        title: '안전 난간 및 가드',
        description: '안전 난간 및 가드 설치 상태 확인',
        status: null,
      },
    ],
  },
  {
    id: 'environmental',
    name: '환경 안전 점검',
    description: '환경 및 대기 오염 방지 점검 항목',
    checklistItems: [
      {
        id: '1',
        title: '배출가스 처리 시설',
        description: '배출가스 처리 시설 작동 상태 확인',
        status: null,
      },
      {
        id: '2',
        title: '폐수 처리 시설',
        description: '폐수 처리 시설 정상 작동 확인',
        status: null,
      },
      {
        id: '3',
        title: '소음 관리 상태',
        description: '소음 수준 측정 및 관리 상태 확인',
        status: null,
      },
    ],
  },
];

export default function InspectionScreen() {
  const [selectedCategory, setSelectedCategory] = useState<InspectionCategory | null>(null);
  const [checklistItems, setChecklistItems] = useState<InspectionCategory['checklistItems']>([]);

  const handleCategorySelect = (category: InspectionCategory) => {
    setSelectedCategory(category);
    // 카테고리 선택 시 체크리스트 초기화
    setChecklistItems(
      category.checklistItems.map((item) => ({ ...item, status: null }))
    );
  };

  const handleStatusChange = (id: string, status: ChecklistStatus) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const handleSubmit = () => {
    const allChecked = checklistItems.every((item) => item.status !== null);
    
    if (!allChecked) {
      Alert.alert('제출 불가', '모든 항목을 확인해주세요.');
      return;
    }

    // 제출 로직 (Mock)
    Alert.alert(
      '점검 제출',
      '점검 결과를 제출하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '제출',
          onPress: () => {
            Alert.alert('제출 완료', '점검 결과가 성공적으로 제출되었습니다.');
            // 제출 후 초기화
            setSelectedCategory(null);
            setChecklistItems([]);
          },
        },
      ]
    );
  };

  const allItemsChecked = checklistItems.length > 0 && checklistItems.every((item) => item.status !== null);

  return (
    <SafeLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-6">
          {/* 헤더 */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              점검
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              안전 점검 및 설비 점검을 기록하세요
            </Text>
          </View>

          {/* 카테고리 선택 */}
          {!selectedCategory ? (
            <View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                점검 카테고리 선택
              </Text>
              <View>
                {inspectionCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => handleCategorySelect(category)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl mb-3 shadow-sm"
                    activeOpacity={0.6}
                  >
                    <View className="flex-row items-center">
                      <View className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg mr-3">
                        <ClipboardCheck size={24} color="#ff8c00" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {category.name}
                        </Text>
                        {category.description && (
                          <Text className="text-sm text-gray-600 dark:text-gray-400">
                            {category.description}
                          </Text>
                        )}
                        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {category.checklistItems.length}개 항목
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View>
              {/* 카테고리 헤더 */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(null);
                      setChecklistItems([]);
                    }}
                    className="mb-2"
                    activeOpacity={0.6}
                  >
                    <Text className="text-sm text-primary-600 dark:text-primary-400">
                      ← 카테고리 선택으로 돌아가기
                    </Text>
                  </TouchableOpacity>
                  <Text className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedCategory.name}
                  </Text>
                  {selectedCategory.description && (
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {selectedCategory.description}
                    </Text>
                  )}
                </View>
              </View>

              {/* 체크리스트 항목 */}
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  점검 항목 ({checklistItems.filter((item) => item.status !== null).length} / {checklistItems.length})
                </Text>
                {checklistItems.map((item) => (
                  <ChecklistItem
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    status={item.status}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </View>

              {/* 제출 버튼 */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!allItemsChecked}
                className={`rounded-xl py-4 shadow-md ${
                  allItemsChecked
                    ? 'bg-primary-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                activeOpacity={allItemsChecked ? 0.7 : 1}
              >
                <View className="flex-row items-center justify-center">
                  <CheckCircle2
                    size={20}
                    color={allItemsChecked ? '#ffffff' : '#9ca3af'}
                  />
                  <Text
                    className={`font-semibold text-base ml-2 ${
                      allItemsChecked ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {allItemsChecked ? '점검 제출' : '모든 항목을 확인해주세요'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeLayout>
  );
}

