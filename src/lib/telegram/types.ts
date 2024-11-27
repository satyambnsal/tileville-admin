// src/lib/telegram/types.ts
export interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
}

export interface CompetitionData {
  name: string;
  entryFee: number;
  startTime: Date;
  prizePool: number;
  endDate?: string | Date;
}

export interface MaintenanceData {
  title: string;
  message: string;
  startTime?: Date;
  duration?: string;
}

export interface UpdateData {
  title: string;
  message: string;
  version?: string;
}

export interface AnnouncementData {
  title: string;
  message: string;
  priority: "normal" | "high" | "urgent";
}
