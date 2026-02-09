import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      api: 'up',
      database: 'config_ready',
      stripe: 'config_ready',
    },
    version: '0.1.0',
  };
  
  return NextResponse.json(checks);
}
