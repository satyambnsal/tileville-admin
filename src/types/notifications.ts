export interface NotificationContent {
  title: string;
  message: string;
  name?: string;
  entryFee?: number;
  startTime?: Date;
  prizePool?: number;
  challengeName?: string;
  prizeAmount?: number;
  transactionHash?: string;
}

export type NotificationType =
  | "competition"
  | "announcement"
  | "maintenance"
  | "prize";

export interface NotificationPayload {
  type: NotificationType;
  content: NotificationContent;
  recipients: string[];
}
