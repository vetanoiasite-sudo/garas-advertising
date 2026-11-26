import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Port 3002 so it runs alongside the clinic app (3001).
export default defineConfig({
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 3002, host: true },
});
