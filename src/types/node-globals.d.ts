// Minimal Node.js global types for environments without @types/node installed.
// Remove this file once @types/node is available in the project.

declare var process: {
  env: { [key: string]: string | undefined };
  cwd: () => string;
  argv: string[];
  exit: (code?: number) => void;
};

declare function require(moduleName: string): any;

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}
