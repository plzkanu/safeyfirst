import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'medium', showText = true, className = '' }: LogoProps) {
  const sizeMap = {
    small: { fontSize: 20, subtitleSize: 12, imageHeight: 24 },
    medium: { fontSize: 32, subtitleSize: 16, imageHeight: 40 },
    large: { fontSize: 40, subtitleSize: 18, imageHeight: 50 },
  };

  const { fontSize, subtitleSize, imageHeight } = sizeMap[size];

  // SOOSAN 로고 이미지 경로
  // 이미지를 mobile/assets/images/soosan-logo.png 또는 logo.png에 추가하세요
  const logoImage: ImageSourcePropType | null = null; // 이미지 추가 시 경로 설정
  // 예: require('@/assets/images/soosan-logo.png')

  return (
    <View className={`items-center ${className}`}>
      {logoImage ? (
        <Image
          source={logoImage}
          style={{ height: imageHeight, width: imageHeight * 3, marginBottom: showText ? 8 : 0 }}
          resizeMode="contain"
        />
      ) : (
        <View className="items-center">
          {/* SOOSAN 텍스트 로고 - BI 스타일 */}
          {/* S, 첫 번째 O, S, A, N은 진한 파란색 */}
          {/* 두 번째 O는 그라데이션 (파란색-청록색) */}
          {/* 세 번째 O는 그라데이션 (녹색-라임) */}
          <View style={styles.logoContainer}>
            <Text style={[styles.letter, { fontSize, color: '#1e40af' }]}>S</Text>
            <Text style={[styles.letter, { fontSize, color: '#1e40af' }]}>O</Text>
            <Text style={[styles.letter, { fontSize, color: '#06b6d4' }]}>O</Text>
            <Text style={[styles.letter, { fontSize, color: '#1e40af' }]}>S</Text>
            <Text style={[styles.letter, { fontSize, color: '#1e40af' }]}>A</Text>
            <Text style={[styles.letter, { fontSize, color: '#22c55e' }]}>O</Text>
            <Text style={[styles.letter, { fontSize, color: '#1e40af' }]}>N</Text>
          </View>
        </View>
      )}
      {showText && (
        <Text className="text-gray-600 dark:text-gray-400 mt-2" style={{ fontSize: subtitleSize }}>
          안전 관리 시스템
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

