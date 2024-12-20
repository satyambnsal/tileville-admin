import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { NotificationPayload } from "@/types/notifications";

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
