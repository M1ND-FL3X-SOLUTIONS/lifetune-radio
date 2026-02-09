type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  userId?: string;
  context?: Record<string, any>;
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };
  
  // Console log always
  console[level](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, context || '');
  
  // Send critical errors to Telegram
  if (level === 'error' && TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    try {
      const text = `🚨 LIFETUNE ERROR\n\n${message}\n\n${JSON.stringify(context || {}, null, 2).slice(0, 500)}`;
      
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
      });
    } catch (telegramError) {
      console.error('Failed to send Telegram alert:', telegramError);
    }
  }
  
  // Could also log to Supabase errors table
  // await supabaseAdmin.from('error_logs').insert(entry);
}

export const logger = {
  info: (msg: string, ctx?: Record<string, any>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, any>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, any>) => log('error', msg, ctx),
};
