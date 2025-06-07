export function logSendResult(
  channel: string,
  patientId: string,
  status: 'success' | 'error',
  info: unknown,
) {
  console.info(JSON.stringify({ channel, patientId, status, info }));
}
