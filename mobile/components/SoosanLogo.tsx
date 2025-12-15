import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SoosanLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export default function SoosanLogo({ size = 'medium', showText = true, className = '' }: SoosanLogoProps) {
  const sizeMap = {
    small: { text: 20, subtitle: 12 },
    medium: { text: 32, subtitle: 16 },
    large: { text: 40, subtitle: 18 },
  };

  const { text: textSize, subtitle: subtitleSize } = sizeMap[size];

  // 로고 이미지 경로 (이미지가 있으면 사용)
  // mobile/assets/images/soosan-logo.png 또는 logo.png
  const logoImage: ImageSourcePropType | null = null; // 이미지 추가 시 경로 설정

  if (logoImage) {
    return (
      <View className={`items-center ${className}`}>
        <Image
          source={logoImage}
          style={{ width: textSize * 6, height: textSize * 1.5 }}
          resizeMode="contain"
        />
        {showText && (
          <Text className="text-gray-600 dark:text-gray-400 mt-2" style={{ fontSize: subtitleSize }}>
            안전 관리 시스템
          </Text>
        )}
      </View>
    );
  }

  // 텍스트 로고 (SOOSAN 스타일)
  // S, 첫 번째 O, S, A, N은 진한 파란색
  // 두 번째 O는 그라데이션 (파란색-청록색)
  // 세 번째 O는 그라데이션 (녹색-라임)
  return (
    <View className={`items-center ${className}`}>
      <View style={styles.logoContainer}>
        <Text style={[styles.letter, { fontSize: textSize, color: '#1e40af' }]}>S</Text>
        <Text style={[styles.letter, { fontSize: textSize, color: '#1e40af' }]}>O</Text>
        <View style={styles.gradientContainer}>
          <Text style={[styles.letter, { fontSize: textSize }]}>O</Text>
        </View>
        <Text style={[styles.letter, { fontSize: textSize, color: '#1e40af' }]}>S</Text>
        <Text style={[styles.letter, { fontSize: textSize, color: '#1e40af' }]}>A</Text>
        <View style={styles.gradientContainer}>
          <Text style={[styles.letter, { fontSize: textSize }]}>O</Text>
        </View>
        <Text style={[styles.letter, { fontSize: textSize, color: '#1e40af' }]}>N</Text>
      </View>
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
  gradientContainer: {
    // React Native에서는 그라데이션 텍스트가 제한적이므로
    // 단색으로 대체하거나 LinearGradient 사용
    // 여기서는 청록색으로 표시
  },
});

