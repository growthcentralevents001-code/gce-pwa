import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

async function getAuthenticatedUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

async function userHasRole(userId: string, roles: string[]) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('approved', true)
    .in('role', roles)
    .limit(1)
  return (data?.length ?? 0) > 0
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowed = await userHasRole(user.id, ['zbp', 'admin'])
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { name, city, address, capacity, type, email, password, zbp_user_id } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

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
