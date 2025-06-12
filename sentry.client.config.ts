import * as Sentry from '@sentry/nextjs';

function containsClinicalData(event: Sentry.Event): boolean {
  const serialized = JSON.stringify(event);
  const keywords = ['patient', 'diagnosis', 'prescription', 'clinical'];
  return keywords.some((k) => serialized.toLowerCase().includes(k));
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  enabled: process.env.NODE_ENV === 'production',
  beforeSend(event) {
    if (containsClinicalData(event)) {
      return null;
    }
    return event;
  },
});
