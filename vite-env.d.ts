/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_ENDPOINT: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
