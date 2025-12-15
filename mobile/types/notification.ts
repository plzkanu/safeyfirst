export type NotificationStatus = 'pending' | 'completed' | 'cancelled';

export type NotificationType = 'report' | 'inspection' | 'alert' | 'announcement';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  date: string;
  description?: string;
}

