import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} } }
  );
  const { affiliateId, newUserId } = await request.json();

  // Insert into affiliate_signups
  const { error } = await supabase
    .from('affiliate_signups')
    .insert({ affiliate_id: affiliateId, user_id: newUserId })
    .select()
    .maybeSingle();
  if (error && error.code !== '23505') { // ignore duplicate
    console.error('Error tracking affiliate signup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
