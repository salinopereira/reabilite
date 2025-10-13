import { createClient } from '@supabase/supabase-js';

// Workaround para o ambiente de build do Firebase App Hosting
// que não injeta as variáveis de ambiente durante o `next build`.

// Se estiver em processo de build (detectado pela variável CI), usa valores dummy.
// No ambiente de execução (runtime), usará as variáveis reais injetadas pelo App Hosting.
const supabaseUrl = process.env.CI 
  ? 'https://dummy.url' 
  : process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey = process.env.CI 
  ? 'dummykey' 
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
