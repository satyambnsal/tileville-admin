// src/lib/telegram/services/userMapService.ts
import { supabaseServiceClient } from "@/db/config/server";

export class UserMapService {
  async linkUser(userAddress: string, chatId: string) {
    const { error } = await supabaseServiceClient.from("telegram_auth").insert({
      wallet_address: userAddress,
      chat_id: chatId,
    });

    if (error) {
      console.error(
        `Error linking wallet ${userAddress} to chat ${chatId}:`,
        error
      );
      throw error;
    }

    console.log(`Linked wallet ${userAddress} to chat ${chatId}`);
  }

  async getChatId(userAddress: string): Promise<string | undefined> {
    const { data, error } = await supabaseServiceClient
      .from("telegram_auth")
      .select("chat_id")
      .eq("wallet_address", userAddress)
      .single();

    if (error || !data || !data.chat_id) return undefined;
    return data.chat_id;
  }

  async getAddressByChatId(chatId: string): Promise<string | undefined> {
    const { data, error } = await supabaseServiceClient
      .from("telegram_auth")
      .select("wallet_address")
      .eq("chat_id", chatId)
      .single();

    if (error || !data || !data.wallet_address) return undefined;
    return data.wallet_address;
  }

  async isChatIdLinked(chatId: string): Promise<boolean> {
    const { data, error } = await supabaseServiceClient
      .from("telegram_auth")
      .select("id")
      .eq("chat_id", chatId)
      .single();

    return !error && !!data;
  }

  async isUserRegistered(userAddress: string): Promise<boolean> {
    const { data, error } = await supabaseServiceClient
      .from("telegram_auth")
      .select("id")
      .eq("wallet_address", userAddress)
      .single();

    return !error && !!data;
  }
}
