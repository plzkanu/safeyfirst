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
  }) => void;
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
  const addReport = useCallback((report: {
    title: string;
    riskType: RiskType;
    urgency: UrgencyLevel;
    content: string;
    photos?: string[];
  }) => {
    const newNotification: NotificationItem = {
      id: `notification-${Date.now()}`,
      type: 'report',
      status: 'pending',
      title: report.title,
      description: report.content,
      date: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
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

