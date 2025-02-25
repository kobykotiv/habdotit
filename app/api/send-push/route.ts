import { NextResponse } from 'next/server'
import webpush from 'web-push'

export async function POST(request: Request) {
  try {
    const { subscription, data } = await request.json()

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: data.title,
        body: data.body,
        icon: data.icon,
        badge: data.badge,
        data: data.data
      })
    )

    return NextResponse.json({ status: 'Success' })
  } catch (error) {
    console.error('Error sending push notification:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
