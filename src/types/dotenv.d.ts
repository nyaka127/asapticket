// Minimal dotenv type definitions for environments without installed packages.
// Remove this file once `dotenv` is installed and @types/dotenv is available.

declare module "dotenv" {
  export interface DotenvConfigOptions {
    path?: string;
    encoding?: string;
    debug?: boolean;
  }

  export interface DotenvParseOutput {
    [name: string]: string;
  }

  export function config(options?: DotenvConfigOptions): { parsed?: DotenvParseOutput };
  export function parse(src: string): DotenvParseOutput;
}
