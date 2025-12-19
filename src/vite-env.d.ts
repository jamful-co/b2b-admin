/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_GRAPHQL_ENDPOINT?: string;
  readonly VITE_COMPANY_ID?: string;
  // 필요한 다른 환경 변수들을 여기에 추가
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

