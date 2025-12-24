import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 저장된 사용자 정보 확인 (Mock)
  useEffect(() => {
    // 실제로는 AsyncStorage에서 토큰 확인
    const checkAuth = async () => {
      // Mock: 항상 로그아웃 상태로 시작
      // 웹에서 새로고침 시 상태 초기화를 위해 약간의 지연 추가
      await new Promise(resolve => setTimeout(resolve, 100));
      setUser(null); // 명시적으로 null로 설정
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Mock 인증 로직
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock 사용자 데이터
        const mockUsers = [
          {
            id: '1',
            email: 'admin@soosan.com',
            password: 'admin123',
            name: '관리자',
            role: 'admin' as const,
          },
          {
            id: '2',
            email: 'user@soosan.com',
            password: 'user123',
            name: '일반사용자',
            role: 'user' as const,
          },
        ];

        const foundUser = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (foundUser) {
          const userData: User = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
          };
          setUser(userData);
          setIsLoading(false);
          // 메인 탭으로 이동
          router.replace('/(tabs)');
          resolve({ success: true });
        } else {
          setIsLoading(false);
          resolve({ success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
      }, 1000); // 1초 지연 (실제 로그인 시뮬레이션)
    });
  };

  const logout = () => {
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

