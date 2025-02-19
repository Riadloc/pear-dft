/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_DOMAIN_NAME: string;
  readonly VITE_BASEURL_DEV: string;
  readonly VITE_BASEURL_PROD: string;
  readonly VITE_YIDUN_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
