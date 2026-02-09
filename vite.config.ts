import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import pkg from "./package.json";

export default defineConfig(({ command }) => ({
  plugins: [solid()],
  base: command === "build" ? "/yugioh-card-guesser/" : "/",

  define: {
    NPM_VERSION: JSON.stringify(pkg.version),
    DB_DATE: JSON.stringify(pkg.meta.dbDate),
    RELEASE_DATE: JSON.stringify(pkg.meta.releaseDate),
  },
}));
