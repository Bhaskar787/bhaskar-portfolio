import eventBus from "@/lib/eventBus";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const onMessage = (contact) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(contact)}\n\n`));
        } catch (e) {
          // Controller closed
        }
      };

      eventBus.on("new-message", onMessage);

      // Heartbeat comment every 15s to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch (e) {
          clearInterval(heartbeat);
        }
      }, 15000);

      req.signal.addEventListener("abort", () => {
        eventBus.off("new-message", onMessage);
        clearInterval(heartbeat);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
