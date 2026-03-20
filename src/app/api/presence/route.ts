import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Ensure global counter exists
if (typeof (globalThis as any).activeConnections === "undefined") {
  (globalThis as any).activeConnections = 0;
}

const MAX_USERS = 100;

export async function GET(req: Request) {
  let interval: NodeJS.Timeout;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Check capacity before incrementing
      if ((globalThis as any).activeConnections >= MAX_USERS) {
        controller.enqueue(
          encoder.encode(`data: {"status":"full", "active":${(globalThis as any).activeConnections}}\n\n`)
        );
        try { controller.close(); } catch (e) {}
        return;
      }

      // Increment correctly
      (globalThis as any).activeConnections += 1;
      let active = (globalThis as any).activeConnections;
      console.log(`[Presence] Connected. Total active: ${active}`);

      try {
        controller.enqueue(
          encoder.encode(`data: {"status":"connected", "active":${active}}\n\n`)
        );
      } catch (err) {
        console.error("SSE Initial Error", err);
      }

      // Keep connection alive
      interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`:\n\n`)); // Keep-alive comment
        } catch (e) {
          clearInterval(interval);
        }
      }, 10000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        (globalThis as any).activeConnections = Math.max(0, (globalThis as any).activeConnections - 1);
        console.log(`[Presence] Disconnected. Total active: ${(globalThis as any).activeConnections}`);
      });
    },
    cancel() {
      clearInterval(interval);
      (globalThis as any).activeConnections = Math.max(0, (globalThis as any).activeConnections - 1);
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
