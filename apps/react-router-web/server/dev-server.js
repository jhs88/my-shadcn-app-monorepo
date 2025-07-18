import { execa } from "execa";

const command =
  'tsx watch --clear-screen=false --ignore ".cache/**" --ignore "app/**" --ignore "vite.config.ts.timestamp-*" --ignore "build/**" --ignore "node_modules/**" --inspect ./index.js';

execa(command, {
  stdio: ["ignore", "inherit", "inherit"],
  shell: true,
  env: {
    FORCE_COLOR: true,
    ...process.env,
  },
  // https://github.com/sindresorhus/execa/issues/433
  windowsHide: false,
});
