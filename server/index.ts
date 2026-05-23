import { buildServer } from "./app.js";

const PORT = 8080;

const server = buildServer();

try {
  await server.listen({ port: PORT }); //, host: '0.0.0.0' });
  console.log(`Server running on port ${PORT}`);
} catch (error) {
  if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "EADDRINUSE") {
    console.error(`ERROR: Port ${PORT} is already in use. Please stop the other process or use a different port.`);
  } else {
    console.error("Failed to start server:", error);
  }
  process.exit(1);
}
