// Minimal stub types for `next/navigation` for editor/TS support when Next.js types are not installed.
// Remove this file once the real `next` types are available.

declare module "next/navigation" {
  export type Router = {
    refresh: () => void;
  };

  export function useRouter(): Router;
}
