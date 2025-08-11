/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MERIT_API_KEY: string
  readonly VITE_MERIT_BASE_URL: string
  readonly VITE_MERIT_CHECKOUT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
