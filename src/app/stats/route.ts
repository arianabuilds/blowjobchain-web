export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Hello world from stats page",
      timestamp: new Date().toLocaleString(),
    }),
  )
}
