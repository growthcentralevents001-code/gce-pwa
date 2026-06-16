import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, city, address, capacity, type, email, password, zbp_user_id } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const user_id = authUser.user.id

    // Insert venue
    const { error: venueError } = await supabaseAdmin
      .from('venues')
      .insert({
        name,
        city,
        address,
        capacity: parseInt(capacity),
        type,
        user_id,
        zbp_id: zbp_user_id,
        status: 'Approved',
      })

    if (venueError) {
      await supabaseAdmin.auth.admin.deleteUser(user_id)
      return NextResponse.json({ error: venueError.message }, { status: 400 })
    }

    // Add venue role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id,
        role: 'venue',
        approved: true,
      })

    if (roleError) {
      await supabaseAdmin.auth.admin.deleteUser(user_id)
      await supabaseAdmin.from('venues').delete().eq('user_id', user_id)
      return NextResponse.json({ error: roleError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user_id })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
