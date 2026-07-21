/**
 * Custom server — wraps Next.js request handling and attaches a
 * Socket.IO server on the same HTTP server/port.
 *
 * Why this exists: Next.js API routes (Route Handlers) are
 * request/response only — they can't hold a persistent WebSocket
 * connection open. Socket.IO needs a long-lived Node HTTP server to
 * attach to, so we create that server ourselves here and hand every
 * normal HTTP request off to Next's request handler, while Socket.IO
 * manages the `/socket.io` upgrade traffic.
 *
 * The io instance is stashed on `global.__io` so that API route
 * handlers (which run in the same Node process) can reach it and
 * emit events — see src/app/api/contact/route.js.
 */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.SITE_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // The admin dashboard calls socket.emit("join-admin") right after
    // connecting; only sockets in this room receive "new-message" events,
    // so a visitor on the public site never opens a socket that matters here.
    socket.on("join-admin", () => {
      socket.join("admin-room");
    });

    socket.on("disconnect", () => {
      // no-op — nothing to clean up per-socket right now
    });
  });

  // Expose io to API route handlers running in this same process.
  global.__io = io;
  process.__io = io;

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port} (Socket.IO attached)`);
  });
});