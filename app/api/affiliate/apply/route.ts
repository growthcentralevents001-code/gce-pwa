import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {}
      }
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, phone, social_handle, follower_count } = await request.json();

  // Check if already applied
  const { data: existing } = await supabase
    .from('marketplace_affiliates')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();
  if (existing) return NextResponse.json({ error: 'Already applied or affiliate' }, { status: 400 });

  const { data, error } = await supabase
    .from('marketplace_affiliates')
    .insert({
      user_id: user.id,
      email: user.email,
      name,
      phone,
      social_handle,
      follower_count: parseInt(follower_count),
      status: 'Pending'
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, affiliate: data });
}
