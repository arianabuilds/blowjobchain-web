"use client"

export function sendNotification(to_id: string, title: string, body = "") {
  return fetch("/api/notify", {
    method: "POST",
    body: JSON.stringify({ to_id, title, body }),
    headers: { "Content-Type": "application/json" },
  })
}
