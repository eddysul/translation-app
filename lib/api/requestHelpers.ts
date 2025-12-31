import { NextResponse } from 'next/server';
import type { ErrorResponse } from '@/lib/types';

export function ensureFieldsPresent(body: any, required: string[]): string | null {
  const missing = required.filter((k) => !(k in body));
  if (missing.length === 0) return null;
  return `Missing required fields: ${missing.join(', ')}`;
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message } as ErrorResponse, { status: 400 });
}

export function serverError(error: unknown, message = 'Internal server error') {
  const errorMessage = error instanceof Error ? error.message : String(error ?? 'Unknown error');
  return NextResponse.json(
    { error: message, details: errorMessage } as ErrorResponse,
    { status: 500 }
  );
}
