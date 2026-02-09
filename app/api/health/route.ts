import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      api: 'up',
      database: 'unknown',
      stripe: 'up',
    },
    version: '0.1.0',
  };
  
  // Test database connection
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    checks.services.database = error ? 'down' : 'up';
  } catch {
    checks.services.database = 'down';
  }
  
  const allHealthy = Object.values(checks.services).every(s => s === 'up');
  checks.status = allHealthy ? 'healthy' : 'degraded';
  
  return NextResponse.json(checks, { 
    status: allHealthy ? 200 : 503 
  });
}
