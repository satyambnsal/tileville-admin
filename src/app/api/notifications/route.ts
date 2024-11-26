import { NextResponse } from 'next/server'
// import { checkAuth } from '@/lib/auth'
import { getBot } from '@/lib/telegramBot'

export async function POST(req: Request) {
  try {
    // checkAuth()

    const tilevilleBot = getBot()

    const { type, content, recipients } = await req.json()

    switch (type) {
      case 'competition':
        for (const recipient of recipients) {
          await tilevilleBot.notifyNewCompetition(recipient, content)
        }
        break
      case 'announcement':
        // Implement general announcement
        break
      case 'maintenance':
        // Implement maintenance notification
        break
      default:
        return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    console.error('Notification error:', err)
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    )
  }
}
