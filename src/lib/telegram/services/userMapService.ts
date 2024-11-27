
// src/lib/telegram/services/userMapService.ts
export class UserMapService {
    private userMap: Map<string, string> = new Map();
  
    async linkUser(userAddress: string, chatId: string) {
      this.userMap.set(userAddress, chatId);
      console.log(`Linked wallet ${userAddress} to chat ${chatId}`);
    }
  
    getChatId(userAddress: string): string | undefined {
      return this.userMap.get(userAddress);
    }
  
    getAddressByChatId(chatId: string): string | undefined {
      for (const [address, id] of this.userMap.entries()) {
        if (id === chatId) return address;
      }
      return undefined;
    }
  
    isChatIdLinked(chatId: string): boolean {
      return Array.from(this.userMap.values()).includes(chatId);
    }
  
    unlinkByChatId(chatId: string): boolean {
      const address = this.getAddressByChatId(chatId);
      if (address) {
        this.userMap.delete(address);
        return true;
      }
      return false;
    }
  
    isUserRegistered(userAddress: string): boolean {
      return this.userMap.has(userAddress);
    }
  }
  