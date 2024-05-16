const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission()
  if (permission !== "granted") throw new Error("Permission not granted for Notification")
}

const subscribeUserToPush = async () => {
  // console.log("Looking for service worker...")
  try {
    const registration = await navigator.serviceWorker.ready
    // console.log({ registration })
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
    })
    // console.log({ subscription })

    await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Push subscription error", err)
  }
}

export async function registerPushNotifications() {
  if (!("serviceWorker" in navigator && "PushManager" in window))
    return console.error("Push notification failure: browser missing serviceWorker or PushManager")

  // Register the service worker
  navigator.serviceWorker
    .register("/service-worker.js")
    // .then((registration) => {
    //  console.log("Service Worker registered with scope:", registration.scope)
    // })
    .catch((error) => {
      console.error("Service Worker registration failed:", error)
    })

  // Subscribe to push notifications
  try {
    await requestNotificationPermission()
    await subscribeUserToPush()
  } catch (error) {
    console.error("Error initializing push notifications", error)
  }
}
