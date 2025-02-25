export async function subscribeUserToPush() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready
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

