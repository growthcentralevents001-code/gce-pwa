import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ saved: false });
  
  const { data } = await supabase
    .from('saved_events')
    .select('id')
    .eq('user_id', user.id)
    .eq('event_id', eventId)
    .maybeSingle();
  return NextResponse.json({ saved: !!data });
}
