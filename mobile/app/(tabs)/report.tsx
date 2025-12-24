import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import SafeLayout from '@/components/SafeLayout';
import RiskTypeDropdown from '@/components/RiskTypeDropdown';
import UrgencyButton from '@/components/UrgencyButton';
import { useNotifications } from '@/contexts/NotificationContext';
import { Camera, X, Image as ImageIcon } from 'lucide-react-native';
import { RiskType, UrgencyLevel } from '@/types/report';

const MAX_PHOTOS = 5;

export default function ReportScreen() {
  const { addReport } = useNotifications();
  const [title, setTitle] = useState('');
  const [riskType, setRiskType] = useState<RiskType | null>(null);
  const [content, setContent] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // 권한 요청
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Alert.alert(
          '권한 필요',
          '사진을 첨부하려면 카메라 및 갤러리 접근 권한이 필요합니다.',
          [{ text: '확인' }]
        );
        return false;
      }
    }
    return true;
  };

  const handleAddPhoto = async () => {
    // 최대 개수 확인
    if (photos.length >= MAX_PHOTOS) {
      Alert.alert('알림', `최대 ${MAX_PHOTOS}장까지 첨부할 수 있습니다.`);
      return;
    }

    // 웹 플랫폼 처리
    if (Platform.OS === 'web') {
      try {
        const input = (typeof document !== 'undefined' && document.createElement('input')) as HTMLInputElement | null;
        if (!input) return;
        
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = false;
        input.onchange = (e: any) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              if (dataUrl) {
                setPhotos((prev) => [...prev, dataUrl].slice(0, MAX_PHOTOS));
              }
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      } catch (error) {
        Alert.alert('오류', '파일 선택 중 오류가 발생했습니다.');
      }
      return;
    }

    // 권한 확인
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    // 갤러리 또는 카메라 선택 다이얼로그
    Alert.alert(
      '사진 첨부',
      '사진을 선택하세요',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '갤러리에서 선택',
          onPress: async () => {
            try {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                allowsMultipleSelection: false,
              });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                const newPhotos = [...photos, result.assets[0].uri];
                setPhotos(newPhotos.slice(0, MAX_PHOTOS));
              }
            } catch (error) {
              Alert.alert('오류', '이미지를 불러오는 중 오류가 발생했습니다.');
            }
          },
        },
        {
          text: '카메라로 촬영',
          onPress: async () => {
            try {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
              });

              if (!result.canceled && result.assets && result.assets.length > 0) {
                const newPhotos = [...photos, result.assets[0].uri];
                setPhotos(newPhotos.slice(0, MAX_PHOTOS));
              }
            } catch (error) {
              Alert.alert('오류', '카메라를 실행하는 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // 유효성 검사
    if (!title.trim()) {
      Alert.alert('입력 오류', '제목을 입력해주세요.');
      return;
    }
    if (!riskType) {
      Alert.alert('입력 오류', '위험 유형을 선택해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('입력 오류', '내용을 입력해주세요.');
      return;
    }
    if (!urgency) {
      Alert.alert('입력 오류', '긴급도를 선택해주세요.');
      return;
    }

    // 제출 로직
    Alert.alert(
      '신고 제출',
      '신고 내용을 제출하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '제출',
          onPress: async () => {
            try {
              // Context에 신고 추가 (API 호출 포함)
              await addReport({
                title: title.trim(),
                riskType: riskType!,
                urgency: urgency!,
                content: content.trim(),
                photos: photos.length > 0 ? photos : undefined,
              });

              Alert.alert('제출 완료', '신고가 성공적으로 제출되었습니다.');
              // 제출 후 초기화
              setTitle('');
              setRiskType(null);
              setContent('');
              setUrgency(null);
              setPhotos([]);
            } catch (error: any) {
              Alert.alert(
                '제출 실패',
                error.message || '신고 등록 중 오류가 발생했습니다.'
              );
            }
          },
        },
      ]
    );
  };

  const isFormValid = title.trim() && riskType && content.trim() && urgency;

  return (
    <SafeLayout>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="pb-6">
          {/* 헤더 */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              신고
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              안전 사고 및 이상 상황을 신고하세요
            </Text>
          </View>

          {/* 제목 입력 */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              제목 <Text className="text-danger-500">*</Text>
            </Text>
            <TextInput
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
              placeholder="신고 제목을 입력하세요"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* 위험 유형 선택 */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              위험 유형 <Text className="text-danger-500">*</Text>
            </Text>
            <RiskTypeDropdown selected={riskType} onSelect={setRiskType} />
          </View>

          {/* 긴급도 선택 */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              긴급도 <Text className="text-danger-500">*</Text>
            </Text>
            <View className="flex-row">
              <UrgencyButton
                level="high"
                selected={urgency === 'high'}
                onSelect={setUrgency}
              />
              <UrgencyButton
                level="medium"
                selected={urgency === 'medium'}
                onSelect={setUrgency}
              />
              <UrgencyButton
                level="low"
                selected={urgency === 'low'}
                onSelect={setUrgency}
              />
            </View>
          </View>

          {/* 내용 입력 */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              내용 <Text className="text-danger-500">*</Text>
            </Text>
            <TextInput
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
              placeholder="상세 내용을 입력하세요"
              placeholderTextColor="#9ca3af"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {content.length} / 1000
            </Text>
          </View>

          {/* 사진 첨부 */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              사진 첨부
            </Text>
            {photos.length < MAX_PHOTOS && (
              <TouchableOpacity
                onPress={handleAddPhoto}
                className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 items-center justify-center"
                activeOpacity={0.6}
              >
                <Camera size={32} color="#9ca3af" />
                <Text className="text-gray-600 dark:text-gray-400 mt-2 text-center">
                  사진을 첨부하세요
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  최대 {MAX_PHOTOS}장까지 첨부 가능 ({photos.length}/{MAX_PHOTOS})
                </Text>
              </TouchableOpacity>
            )}

            {/* 첨부된 사진 목록 */}
            {photos.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  첨부된 사진 ({photos.length}/{MAX_PHOTOS})
                </Text>
                <View className="flex-row flex-wrap">
                  {photos.map((photo, index) => (
                    <View key={index} className="relative mr-2 mb-2">
                      <Image
                        source={{ uri: photo }}
                        className="w-24 h-24 rounded-lg"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => handleRemovePhoto(index)}
                        className="absolute -top-2 -right-2 bg-danger-500 rounded-full p-1.5 shadow-lg"
                        activeOpacity={0.7}
                      >
                        <X size={14} color="#ffffff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {photos.length < MAX_PHOTOS && (
                    <TouchableOpacity
                      onPress={handleAddPhoto}
                      className="w-24 h-24 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg items-center justify-center"
                      activeOpacity={0.6}
                    >
                      <ImageIcon size={24} color="#9ca3af" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* 제출 버튼 */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!isFormValid}
            className={`rounded-xl py-4 shadow-md ${
              isFormValid
                ? 'bg-danger-500'
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
            activeOpacity={isFormValid ? 0.7 : 1}
          >
            <Text
              className={`font-semibold text-base text-center ${
                isFormValid ? 'text-white' : 'text-gray-500'
              }`}
            >
              {isFormValid ? '신고 제출' : '모든 필수 항목을 입력해주세요'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeLayout>
  );
}

