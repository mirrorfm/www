/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.png' {
  const src: string
  export default src
}

declare module 'react-slugify' {
  export default function slugify(text: string): string
}

declare module 'mousetrap' {
  export function bind(key: string, callback: () => void): void
  export function unbind(key: string): void
}
