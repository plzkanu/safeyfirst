import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import SafeLayout from '@/components/SafeLayout';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <SafeLayout>
      <ScrollView className="flex-1">
        <View>
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              설정
            </Text>
            <Text className="text-base text-gray-600 dark:text-gray-400">
              애플리케이션 설정을 관리하세요
            </Text>
          </View>

          {/* 사용자 정보 */}
          {user && (
            <View className="bg-primary-50 dark:bg-primary-900/20 p-5 rounded-xl mb-4">
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                현재 로그인
              </Text>
              <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {user.name}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </Text>
              <Text className="text-xs text-primary-600 dark:text-primary-400 mt-2">
                {user.role === 'admin' ? '관리자' : '일반 사용자'}
              </Text>
            </View>
          )}
          
          <View className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl mb-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              계정 설정
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              계정 정보 및 로그인 설정
            </Text>
          </View>

          <View className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl mb-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              알림 설정
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              푸시 알림 및 알림 설정
            </Text>
          </View>

          <View className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl mb-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              정보
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              앱 버전 및 정보
            </Text>
          </View>

          {/* 로그아웃 버튼 */}
          <TouchableOpacity
            className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 p-5 rounded-xl flex-row items-center justify-between shadow-sm"
            onPress={handleLogout}
            activeOpacity={0.6}
          >
            <View>
              <Text className="text-lg font-semibold text-danger-600 dark:text-danger-400 mb-1">
                로그아웃
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                계정에서 로그아웃합니다
              </Text>
            </View>
            <LogOut size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeLayout>
  );
}

