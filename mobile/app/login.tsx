import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import SafeLayout from '@/components/SafeLayout';
import Logo from '@/components/Logo';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert('로그인 실패', result.error || '로그인에 실패했습니다.');
    }
  };

  return (
    <SafeLayout className="justify-center" statusBarStyle="dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            {/* 로고 영역 */}
            <View className="mb-12">
              <Logo size="large" showText={true} />
            </View>

            {/* 로그인 폼 */}
            <View>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  이메일
                </Text>
                <TextInput
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  placeholder="이메일을 입력하세요"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  비밀번호
                </Text>
                <TextInput
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                  onSubmitEditing={handleLogin}
                />
              </View>

              <TouchableOpacity
                className={`bg-primary-500 rounded-xl py-4 mt-6 shadow-md ${
                  isSubmitting ? 'opacity-50' : ''
                }`}
                onPress={handleLogin}
                disabled={isSubmitting}
                activeOpacity={isSubmitting ? 1 : 0.7}
              >
                {isSubmitting ? (
                  <View className="flex-row items-center justify-center">
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text className="text-white font-semibold text-base ml-2">
                      로그인 중...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white font-semibold text-base text-center">
                    로그인
                  </Text>
                )}
              </TouchableOpacity>

              {/* 테스트 계정 안내 */}
              <View className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <Text className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2">
                  테스트 계정
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  관리자: admin@soosan.com / admin123
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  사용자: user@soosan.com / user123
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeLayout>
  );
}

