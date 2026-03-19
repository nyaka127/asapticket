// Stub types for next/server used by the editor in environments where Next.js is not installed.
// Remove or replace these once the real Next.js types are available.

declare module "next/server" {
  export type NextRequest = any;
  export class NextResponse {
    static json(body: unknown, init?: ResponseInit): NextResponse;
    static redirect(url: string, status?: number): NextResponse;
    constructor(body?: BodyInit | null, init?: ResponseInit);
  }
}
