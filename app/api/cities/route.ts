import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // Use raw SQL to bypass RLS
  const { data, error } = await supabase
    .rpc('get_cities')
  
  if (error) {
    // Fallback: direct query
    const { data: directData, error: directError } = await supabase
      .from('cities')
      .select('*')
      .order('name')
    
    if (directError) {
      return NextResponse.json({ error: directError.message }, { status: 500 })
    }
    return NextResponse.json({ cities: directData })
  }
  
  return NextResponse.json({ cities: data })
}
