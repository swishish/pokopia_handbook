// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  trailingSlash: "always",
  server: {
    host: "127.0.0.1",
    port: 4721,
  },
  preview: {
    host: "127.0.0.1",
    port: 4721,
  },
});
