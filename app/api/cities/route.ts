import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('city')
    .not('city', 'is', null)

  if (!eventsError && events?.length) {
    const cities = Array.from(
      new Set(events.map((e) => e.city?.trim()).filter(Boolean) as string[])
    ).sort((a, b) => a.localeCompare(b))
    return NextResponse.json({ cities })
  }

  const { data: venues, error: venuesError } = await supabase
    .from('venues')
    .select('city')
    .not('city', 'is', null)

  if (!venuesError && venues?.length) {
    const cities = Array.from(
      new Set(venues.map((v) => v.city?.trim()).filter(Boolean) as string[])
    ).sort((a, b) => a.localeCompare(b))
    return NextResponse.json({ cities })
  }

  const message = eventsError?.message || venuesError?.message || 'No cities found'
  return NextResponse.json({ error: message }, { status: 500 })
}
