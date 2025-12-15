export type ChecklistStatus = 'checked' | 'unchecked' | 'pending' | null;

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  status: ChecklistStatus;
}

export interface InspectionCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  checklistItems: ChecklistItem[];
}

