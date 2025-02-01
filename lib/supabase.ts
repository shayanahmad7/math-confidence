import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://hzscnyuolmjkaabeyomo.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6c2NueXVvbG1qa2FhYmV5b21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTgzNjEsImV4cCI6MjA1Mzk5NDM2MX0.AuoFQlgMDZ3KILjN5Saq720YW7zdtRh-gGFoLqpSEhk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

