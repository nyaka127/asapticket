// Minimal JSX typing to satisfy TypeScript when React types are not installed.
// Remove this file once @types/react is available.

declare namespace JSX {
  interface Element {}
  interface ElementClass {
    render: any;
  }
  interface IntrinsicElements {
    // Allow any HTML tag
    [elemName: string]: any;
  }
  interface IntrinsicAttributes {
    [key: string]: any;
  }
}

declare module "react" {
  export type ReactNode = any;
  export const createElement: any;
  export const Fragment: any;

  export function useState<S>(initialState: S | (() => S)):
    [S, (nextState: S | ((prevState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;

  export type FormEvent<T = Element> = any;
  export type ChangeEvent<T = Element> = any;
}

declare namespace React {
  export type ReactNode = any;
  export type FormEvent<T = Element> = any;
  export type ChangeEvent<T = Element> = any;
}
