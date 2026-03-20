/// <reference types="vite/client" />

declare module "*.jsonc" {
  const value: Record<string, unknown>;
  export default value;
}
