import { NextResponse } from "next/server";
// import { checkAuth } from '@/lib/auth'
import { getBot } from "@/lib/telegram";

export async function POST() {
  try {
    const tilevilleBot = getBot();
    const payload = await tilevilleBot.start();
    console.log("PAYLOAD", payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("ERROR STARTING BOT", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
