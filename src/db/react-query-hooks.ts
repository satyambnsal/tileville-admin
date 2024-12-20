import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface NotificationContent {
  title: string;
  message: string;
  entryFee?: number;
  prizePool?: number;
  startTime?: Date;
  name?: string;
}

interface NotificationPayload {
  type: "competition" | "announcement" | "maintenance";
  content: NotificationContent;
  recipients: string[];
}

export const useNotification = () => {
  return useMutation({
    mutationFn: async (payload: NotificationPayload) => {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send notification");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Notification sent successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Error: ${error.message || "Failed to send notification"}`);
    },
  });
};
