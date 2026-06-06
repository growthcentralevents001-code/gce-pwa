import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
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

  // Get affiliate record
  const { data: affiliate, error } = await supabase
    .from('marketplace_affiliates')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 });
  if (!affiliate) return NextResponse.json({ error: 'No affiliate record found' }, { status: 404 });

  // Get onboarded venues
  const { data: venues } = await supabase
    .from('affiliate_venues')
    .select('venue_id, venues(name, city, status)')
    .eq('affiliate_id', affiliate.id);
  // Get commission history (total earned)
  const { data: commissions } = await supabase
    .from('affiliate_commission_history')
    .select('commission_amount, paid')
    .eq('affiliate_id', affiliate.id);
  const totalEarned = commissions?.reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;
  const pendingPayout = commissions?.filter(c => !c.paid).reduce((sum, c) => sum + (c.commission_amount || 0), 0) || 0;

  // Generate referral link
  const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dev.growthcentralevents.com'}/signup?ref=${affiliate.id}`;

  return NextResponse.json({
    affiliate,
    venues: venues || [],
    stats: { totalEarned, pendingPayout, totalVenues: venues?.length || 0 },
    referralLink
  });
}
