import { NextResponse } from 'next/server'
import webpush from 'web-push'

const vapidDetails = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
  subject: process.env.VAPID_SUBJECT!
}

webpush.setVapidDetails(
  vapidDetails.subject,
  vapidDetails.publicKey,
  vapidDetails.privateKey
)

export async function POST(request: Request) {
  try {
    const subscription = await request.json()
    // Store subscription in your database here
    
    return NextResponse.json({ status: 'Success' })
  } catch (error) {
    return NextResponse.json({ error: 'Error saving subscription' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY })
}
