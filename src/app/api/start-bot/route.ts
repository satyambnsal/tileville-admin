import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth'
import { getBot } from '@/lib/telegramBot'

export async function POST() {
  try {
    const tilevilleBot = getBot()
    const payload = await tilevilleBot.start()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
