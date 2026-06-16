import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const start = Date.now();
  const { error } = await supabase.from('events').select('id', { count: 'exact', head: true });
  const dbLatency = Date.now() - start;
  const status = error ? 'degraded' : 'healthy';
  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbLatency: `${dbLatency}ms`,
  });
}
