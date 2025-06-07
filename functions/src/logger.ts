export function logSendResult(channel: string, patientId: string, status: string, info: any) {
  console.info(JSON.stringify({ channel, patientId, status, info }));
}
