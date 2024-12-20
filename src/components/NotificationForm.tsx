"use client";

import { useNotification } from "@/db/react-query-hooks";
import { useState } from "react";
import { NotificationType, NotificationContent } from "@/types/notifications";

type RecipientType = "all" | "specific";

interface FormState {
  title: string;
  message: string;
  entryFee: string;
  prizePool: string;
  addresses: string;
  challengeName: string;
  prizeAmount: string;
  transactionHash: string;
}

const initialFormState: FormState = {
  title: "",
  message: "",
  entryFee: "1",
  prizePool: "100",
  addresses: "",
  challengeName: "",
  prizeAmount: "",
  transactionHash: "",
};

export default function NotificationForm() {
  const [type, setType] = useState<NotificationType>("competition");
  const [recipients, setRecipients] = useState<RecipientType>("all");
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const { mutate: sendNotification, isPending } = useNotification();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let content: NotificationContent = {
      title: formData.title,
      message: formData.message,
    };

    if (type === "competition") {
      content = {
        ...content,
        name: formData.title,
        entryFee: parseFloat(formData.entryFee),
        startTime: new Date(),
        prizePool: parseFloat(formData.prizePool),
      };
    } else if (type === "prize") {
      content = {
        title: "Prize Won! 🎉",
        message: `Congratulations! You've won ${formData.prizeAmount} MINA in the "${formData.challengeName}" challenge.\n\nTransaction Hash: ${formData.transactionHash}`,
        challengeName: formData.challengeName,
        prizeAmount: parseFloat(formData.prizeAmount),
        transactionHash: formData.transactionHash,
      };
    }

    const recipientList =
      recipients === "all"
        ? ["all"]
        : formData.addresses.split(",").map((addr) => addr.trim());

    await sendNotification({
      type,
      content,
      recipients: recipientList,
    });

    setFormData(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Notification Type">
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as NotificationType)}
          className="w-full p-2 border rounded"
        >
          <option value="competition">New Competition</option>
          <option value="announcement">General Announcement</option>
          <option value="maintenance">Maintenance Alert</option>
          <option value="prize">Prize Notification</option>
        </select>
      </FormField>

      {type !== "prize" && (
        <>
          <FormField label="Title">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </FormField>

          <FormField label="Message">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={4}
              required
            />
          </FormField>
        </>
      )}

      {type === "competition" && (
        <>
          <FormField label="Entry Fee (MINA)">
            <input
              type="number"
              name="entryFee"
              value={formData.entryFee}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.1"
              required
            />
          </FormField>

          <FormField label="Prize Pool (MINA)">
            <input
              type="number"
              name="prizePool"
              value={formData.prizePool}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.1"
              required
            />
          </FormField>
        </>
      )}

      {type === "prize" && (
        <>
          <FormField label="Challenge Name">
            <input
              type="text"
              name="challengeName"
              value={formData.challengeName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </FormField>

          <FormField label="Prize Amount (MINA)">
            <input
              type="number"
              name="prizeAmount"
              value={formData.prizeAmount}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.1"
              required
            />
          </FormField>

          <FormField label="Transaction Hash">
            <input
              type="text"
              name="transactionHash"
              value={formData.transactionHash}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </FormField>
        </>
      )}

      <FormField label="Recipients">
        <select
          name="recipients"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value as RecipientType)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="all">All Users</option>
          <option value="specific">Specific Addresses</option>
        </select>

        {recipients === "specific" && (
          <textarea
            name="addresses"
            value={formData.addresses}
            onChange={handleInputChange}
            placeholder="Enter wallet addresses, separated by commas"
            className="w-full p-2 border rounded mt-2"
            rows={3}
            required
          />
        )}
      </FormField>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isPending ? "Sending..." : "Send Notification"}
      </button>
    </form>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      {children}
    </div>
  );
}
