import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Buffer } from 'buffer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const filename = crypto.randomUUID()
  const arrayBuffer = await file.arrayBuffer()
  const { data, error } = await supabase.storage
    .from('public')
    .upload(`images/${filename}`, Buffer.from(arrayBuffer), {
      contentType: file.type,
      upsert: false,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const {
    data: { publicUrl },
  } = supabase.storage.from('public').getPublicUrl(`images/${filename}`)

  return NextResponse.json({ url: publicUrl })
}
