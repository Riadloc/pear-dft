/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOMAIN_NAME: string;
  readonly VITE_BASEURL_DEV: string;
  readonly VITE_BASEURL_PROD: string;
  readonly VITE_YIDUN_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
