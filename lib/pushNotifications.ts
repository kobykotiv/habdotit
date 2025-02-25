export async function subscribeUserToPush() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      // Register custom service worker (sw.js) for auto check-in
      const registration = await navigator.serviceWorker.register("/sw.js")
      await registration.update()
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      // Send the subscription to your server
      await fetch("/api/push-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      })

      return subscription
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      throw error
    }
  } else {
    throw new Error("Push notifications are not supported in this browser")
  }
}

export async function sendPushNotification(subscription: PushSubscription, data: any) {
  try {
    await fetch("/api/send-push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription,
        data,
      }),
    })
  } catch (error) {
    console.error("Error sending push notification:", error)
    throw error
  }
}

export async function scheduleHabitReminder(habit: any) {
  const subscription = await subscribeUserToPush()
  if (!subscription) return

  await sendPushNotification(subscription, {
    title: `Time for ${habit.name}!`,
    body: "Don't break your streak! Complete your habit now.",
    icon: "/icon.png",
    badge: "/badge.png",
    data: { habitId: habit.id },
  })
}

