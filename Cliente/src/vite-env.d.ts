/// <reference types="vite/client" />

// Opcional: tipa tu variable si la usas
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}