import React, { createContext, useContext, useState, useCallback } from 'react';
import { NotificationItem, NotificationStatus, NotificationType } from '@/types/notification';
import { RiskType, UrgencyLevel } from '@/types/report';

interface NotificationContextType {
  notifications: NotificationItem[];
  addReport: (report: {
    title: string;
    riskType: RiskType;
    urgency: UrgencyLevel;
    content: string;
    photos?: string[];
  }) => Promise<void>;
  updateNotificationStatus: (id: string, status: NotificationStatus) => void;
  getRecentReports: (limit?: number) => NotificationItem[];
  getReportsByStatus: (status: NotificationStatus) => NotificationItem[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 초기 더미 데이터 생성
const generateInitialData = (): NotificationItem[] => {
  const types: NotificationType[] = ['report', 'inspection', 'alert', 'announcement'];
  const statuses: NotificationStatus[] = ['pending', 'completed', 'cancelled'];
  
  const titles = [
    '발전소 A구역 화재 위험 신고',
    '일일 장비 점검 완료',
    '비상 대응 훈련 알림',
    '신규 안전 규정 공지',
    '전기 배전반 이상 신고',
    '화재 예방 점검 완료',
    '겨울철 안전 관리 강화 안내',
    '냉각 시스템 점검 완료',
    '감전 위험 요소 신고',
    '연말 안전 점검 일정 안내',
  ];

  const descriptions = [
    '발전소 A구역에서 화재 위험 요소가 발견되었습니다.',
    '일일 장비 점검이 정상적으로 완료되었습니다.',
    '비상 대응 훈련이 예정되어 있습니다.',
    '신규 안전 규정이 시행됩니다.',
    '전기 배전반에서 이상 징후가 발견되었습니다.',
    '화재 예방 점검이 완료되었습니다.',
    '겨울철 안전 관리 강화를 위한 안내입니다.',
    '냉각 시스템 점검이 완료되었습니다.',
    '감전 위험 요소가 신고되었습니다.',
    '연말 안전 점검 일정을 안내드립니다.',
  ];

  const dates = [
    '2024-12-15T10:30:00',
    '2024-12-14T15:20:00',
    '2024-12-13T09:00:00',
    '2024-12-12T14:15:00',
    '2024-12-11T11:45:00',
    '2024-12-10T16:30:00',
    '2024-12-09T08:20:00',
    '2024-12-08T13:10:00',
    '2024-12-07T10:00:00',
    '2024-12-06T14:45:00',
  ];

  return titles.map((title, index) => ({
    id: `notification-${index + 1}`,
    type: types[index % types.length],
    status: statuses[index % statuses.length] as NotificationStatus,
    title,
    description: descriptions[index],
    date: dates[index],
  }));
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(generateInitialData());

  // 신고 추가
  const addReport = useCallback(async (report: {
    title: string;
    riskType: RiskType;
    urgency: UrgencyLevel;
    content: string;
    photos?: string[];
  }) => {
    try {
      // API 엔드포인트 설정 (환경 변수 또는 기본값)
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
      
      // 사진 처리: 배열을 단일 경로로 변환하거나 첫 번째 사진만 사용
      // photo_path는 한 번만 전달되도록 주의
      const photo_path = report.photos && report.photos.length > 0 
        ? report.photos[0] // 첫 번째 사진만 사용하거나, 필요시 콤마로 구분된 문자열로 변환
        : null;

      // API 요청 데이터 준비 - photo_path만 전달 (photos 배열과 중복되지 않도록)
      const requestData: any = {
        title: report.title,
        risk_type: report.riskType,
        urgency: report.urgency,
        content: report.content,
      };

      // photo_path가 있을 때만 추가 (중복 방지)
      if (photo_path) {
        requestData.photo_path = photo_path;
      }

      // API 호출
      const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '신고 등록 중 오류가 발생했습니다.');
      }

      const result = await response.json();

      // 성공 시 로컬 상태에도 추가
      const newNotification: NotificationItem = {
        id: result.id || `notification-${Date.now()}`,
        type: 'report',
        status: 'pending',
        title: report.title,
        description: report.content,
        date: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
    } catch (error: any) {
      // 에러 발생 시 사용자에게 알림
      console.error('신고 등록 오류:', error);
      throw error; // 호출하는 쪽에서 에러 처리할 수 있도록 throw
    }
  }, []);

  // 알림 상태 업데이트
  const updateNotificationStatus = useCallback((id: string, status: NotificationStatus) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  }, []);

  // 최근 신고 가져오기
  const getRecentReports = useCallback((limit: number = 5) => {
    return notifications
      .filter((item) => item.type === 'report')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [notifications]);

  // 상태별 신고 가져오기
  const getReportsByStatus = useCallback((status: NotificationStatus) => {
    return notifications.filter((item) => item.status === status);
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addReport,
        updateNotificationStatus,
        getRecentReports,
        getReportsByStatus,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

