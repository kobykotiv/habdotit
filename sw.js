/* ...existing service worker setup code if any... */

self.addEventListener("push", (event) => {
  // You can use event.data to customize behavior
  const data = event.data ? event.data.json() : {}
  
  // Optionally show a notification
  const title = data.title || "Automatic Check-In"
  const options = {
    body: data.body || "Your habit has been checked in automatically.",
    /* ...additional options... */
  }
  
  event.waitUntil(
    (async () => {
      // Trigger automatic check-in by calling your API endpoint
      await fetch("/api/auto-checkin")
      // Show notification to user (if needed)
      await self.registration.showNotification(title, options)
    })()
  )
})



/* ...existing service worker code... */
